import { combineLatest, of, interval } from "rxjs"
import { map, mergeMap, flatMap, tap, publishReplay, share, shareReplay, catchError } from "rxjs/operators"
import { get, isFunction, isObject } from "lodash-es"
import * as tf from "@tensorflow/tfjs-core"
window.tf = tf

import Symbols from "./symbols"

import Mouse from "./modules/Mouse"
import Shape from "./modules/Shape"
import Size from "./modules/Size"
import Rank from "./modules/Rank"
import Mean from "./modules/Mean"
import Min from "./modules/Min"
import Max from "./modules/Max"

class Interpreter {
    issues = null

    rootEnv = {
        [Symbols.doc]: `Hello.`,

        empty: {},
        false: false,
        true: true,

        Shape,
        Size,
        Rank,
        Mean,
        Min,
        Max,

        "+": binarize(tf.add),
        "-": binarize(tf.sub),
        "*": binarize(tf.mul),
        "×": binarize(tf.mul),
        "/": binarize(tf.div),
        "÷": binarize(tf.div),
        "^": binarize(tf.pow),
        "%": binarize(tf.mod),
        "@": binarize(tf.matMul),
        "⊗": binarize(tf.matMul),

        Mouse
    }

    interpret = (ast, env = {}, issues) => {
        this.issues = issues

        const state = of(Object.assign(Object.create(this.rootEnv), env))
        const result = this.processToken(ast, state)
        console.log("Interpreting result:", result)

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
                    (state) => Object.create(state)
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
                            return Object.assign(state, stateDelta)
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
                map(
                    ([path, value]) => ({
                        [path]: value
                    })
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
            let value

            if (!token.function) {
                return this.processToken(token.argument, state)
            }

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
                map(
                    ([fn, arg]) => call(fn, arg)
                ),
                catchError(e => {
                    const issue = {
                        source: token._source || null,
                        message: e.message,
                        severity: "error"
                    }
        
                    this.reportIssue(issue)
                    return of(e)
                }),
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
                            throw new Error(`No value for ${path.join(".")}`)
                        }
                        return value
                    }
                ),
                catchError(e => {
                    const issue = {
                        source: token._source || null,
                        message: e.message,
                        severity: "error"
                    }
        
                    this.reportIssue(issue)
                    return of(e)
                }),
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
        BinaryOperation: (token, state) => {
            const left = this.processToken(token.left, state)
            const right = this.processToken(token.right, state)
            const fn = of(this.rootEnv[token.operator])

            return combineLatest(fn, left, right).pipe(
                tap(
                    ([fn, left, right]) => {
                        console.groupCollapsed("Binary operation")
                        console.log("Applying binary operation")
                        console.log("Operation", fn)
                        console.log("Left argument", left)
                        console.log("Right argument", right)
                    }
                ),
                map(
                    ([fn, a, b]) => {
                        return call(fn, { a, b })
                    }
                ),
                catchError(e => {
                    const issue = {
                        source: token._source || null,
                        message: e.message,
                        severity: "error"
                    }
        
                    this.reportIssue(issue)
                    return of(e)
                }),
                tap(
                    (result) => {
                        console.log("Result from binary operation:", result)
                        console.groupEnd()
                    }
                ),
            )
        },
        UnaryOperation: (token, state) => {

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
        __unknown__: (token, state) => {
            throw new Error(`Unrecognized token: ${token.type}, rest: ${token}`)
        }
    }

}

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

    throw new Error(`${fn} is not callable.`)
}

const binarize = (fn) => (({ a, b }) => fn(a, b))

export default new Interpreter