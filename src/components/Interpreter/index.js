import { combineLatest, of, throwError } from "rxjs"
import { map, tap, shareReplay, catchError, switchMap } from "rxjs/operators"
import { get, isFunction, isObject, set, merge, assign } from "lodash-es"

import Symbols from "./symbols"
import RootEnv from "./rootEnvironment"

class Interpreter {
    issues = null

    rootEnv = RootEnv

    interpret = (ast, env = {}, issues) => {
        this.issues = issues

        const state = of(Object.assign(Object.create(this.rootEnv), { Self: this.rootEnv }, env))
        const result = this.processToken(ast, state)

        return {
            success: {
                result,
                state
            }
        }
    }

    processToken = (token, state) => {
        console.log(token)
        if (!state) { console.error("No state to operate on!") }

        const fn = this.tokenActions[token.type] || this.tokenActions.__unknown__
        let result
        try {
            result = fn(token, state)
        } catch (e) {
            const issue = {
                source: token._source || null,
                message: e.message,
                severity: e.severity
            }

            this.reportIssue(issue)
            console.error(e)

            result = null
        }

        return result
    }

    reportIssue({ source, message, severity = "error" }) {
        const issue = {
            ...source,
            message,
            severity
        }
        this.issues.next(issue)
    }

    catchIssue = (e, token, value) => {
        const issue = {
            source: token._source || null,
            message: e.message,
            severity: "error"
        }

        this.reportIssue(issue)
        return value || of(e)
    }

    tokenActions = {
        Program: (token, state) => {
            let stateAcc = state.pipe(
                tap(
                    (state) => {
                        console.groupCollapsed("State")
                        console.log("Create new state from:", state)
                    }
                ),
                map(
                    (state) => Object.assign(
                        Object.create(state),
                        {
                            [Symbols.meta]:  {}
                        }
                    )
                ),
                shareReplay(),
                tap(
                    (state) => {
                        console.log("New state:", (state))
                        console.groupEnd()
                    }
                )
            )

            token.value.forEach(token => {
                const stateDelta = this.processToken(token, stateAcc)
                stateAcc = combineLatest(stateAcc, stateDelta).pipe(
                    tap(
                        ([state, stateDelta]) => {
                            console.groupCollapsed("State merge")
                            console.log("Going to merge state and stateDelta", state, stateDelta)
                        }
                    ),
                    map(
                        ([state, stateDelta]) => {
                            const key = Object.keys(stateDelta)[0]
                            let newState
                            let meta = merge(state[Symbols.meta], stateDelta[Symbols.meta])
                            if (state.hasOwnProperty(key)) {
                                newState = merge(state, stateDelta)
                            } else {
                                // newState = assign(state, stateDelta)
                                newState = Object.assign(state, stateDelta)
                            }
                            newState[Symbols.meta] = meta

                            return newState
                        }
                    ),
                    tap(
                        (state) => {
                            console.log("New merged state", state)
                            console.groupEnd()
                        }
                    ),
                    shareReplay(),
                )
            })

            return stateAcc
        },
        Assignment: (token, state) => {
            const path = this.processToken(token.path, state)
            const value = this.processToken(token.value, state)

            return combineLatest(path, value).pipe(
                tap(
                    ([path, value]) => {
                        console.groupCollapsed("Assignment")
                        console.log("Creating state delta", path, value)
                    }
                ),
                catchError(
                    e => this.catchIssue(e, token)
                ),
                map(
                    ([path, value]) => {
                        const metaPath = [Symbols.meta, ...path]
                        const obj = set({}, metaPath, {
                            silent: token.silent,
                            source: token._source
                        })

                        set(obj, path, value)
                        return obj
                    }
                ),
                tap(
                    (stateDelta) => {
                        console.log("New state delta", stateDelta)
                        console.groupEnd()
                    }
                )
            )
        },
        Path: (token, state) => of(token.value),
        FunctionApplication: (token, state) => {
            const fn = this.processToken(token.function, state)
            const arg = this.processToken(token.argument, state)

            return combineLatest(fn, arg).pipe(
                tap(
                    ([fn, arg]) => {
                        console.groupCollapsed("Function Application")
                        console.log("Function", fn)
                        console.log("Argument", arg)
                    }
                ),
                switchMap(
                    ([fn, arg]) => {
                        return call(fn, arg)
                    }
                ),
                catchError(
                    e => this.catchIssue(e, token)
                ),
                tap(
                    (value) => {
                        console.log("Value", value)
                        console.groupEnd()
                    }
                )
            )
        },
        Reference: (token, state) => {
            const path = this.processToken(token.value, state)
            return combineLatest(path, state).pipe(
                tap(
                    ([path, state]) => {
                        console.groupCollapsed("Reference")
                        console.log("Getting a value from reference")
                        console.log("Path", path)
                        console.log("State", state)
                    }
                ),
                map(
                    ([path, state]) => {
                        const value = get(state, path)
                        if (value === undefined) {
                            // return throwError(new Error(`No value for ${path.join(".")}`))
                            throw new Error(`No value for ${path.join(".")}`)
                        }
                        return value
                    }
                ),
                catchError(
                    e => this.catchIssue(e, token, of(undefined))
                ),
                tap(
                    (value) => {
                        console.log("Value", value)
                        console.groupEnd()
                    }
                )
            )
        },
        Function: (token, state) => {
            return state.pipe(
                tap(
                    (state) => {
                        console.groupCollapsed("Function")
                        console.log("State", state)
                        console.log("Argument", token.argument)
                    }
                ),
                map(
                    (state) => {
                        const fn = (arg) => {
                            const boundEnv = Object.assign(Object.create(state), {
                                [token.argument]: arg
                            })
                            return this.processToken(token.value, of(boundEnv))
                        }

                        return fn
                    }
                ),
                tap(
                    (fn) => {
                        console.log("Function", fn)
                        console.groupEnd()
                    }
                )
            )
        },
        Operation: (token, state) => {
            const left = this.processToken(token.left, state)
            const right = this.processToken(token.right, state)
            const fn = of(this.rootEnv[token.operator])

            return combineLatest(fn, left, right).pipe(
                tap(
                    ([fn, left, right]) => {
                        console.groupCollapsed("Operation")
                        console.log("Operator", fn)
                        console.log("Left argument", left)
                        console.log("Right argument", right)
                    }
                ),
                map(
                    ([fn, a, b]) => {
                        return call(fn, { a, b })
                    }
                ),
                catchError(
                    e => this.catchIssue(e, token)
                ),
                tap(
                    (result) => {
                        console.log("Result from operation:", result)
                        console.groupEnd()
                    }
                ),
            )
        },
        Tensor: (token, state) => {
            const value = this.processToken(token.value, state)
            return of(tf.tensor(value))
        },
        TensorLiteral: (token, state) => token.value,
        Object: (token, state) => {
            const result = this.processToken(token.value, state)
            return result
        },
        String: (token, state) => of(token.value),
        None: (token, state) => of(undefined),
        __unknown__: (token, state) => {
            throw new Error(`Unrecognized token: ${token.type}, rest: ${token}`)
        }
    }

}

// TODO: when arg is {}, consider only own props
// arg = isObject(arg) ? {...arg} : arg
const call = (fn, arg) => {

    if (isFunction(fn)) {
        return fn(arg)
    }

    if (isObject(fn)) {
        const isCallable = fn.hasOwnProperty(Symbols.call)

        if (isCallable) {
            return call(fn[Symbols.call], arg)
        }
    }

    throw new Error(`${fn} is not callable`)
}

export default new Interpreter