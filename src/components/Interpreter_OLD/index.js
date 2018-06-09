import runtimeEnvironment from "./runtimeEnvironment"
import * as tf from "@tensorflow/tfjs-core"
import { isPlainObject, isFunction, has, hasIn, set, get, merge, isObject } from "lodash-es"
import { Subject, Observable, combineLatest, of } from "rxjs"
import { map } from "rxjs/operators"

import { operatorToFunction } from "./operators"
import { SYMBOLS } from "./symbols"

import { forEach_async, get_async, combineLatestObj } from "./utils"

class Interpreter {
    issues = new Subject()
    tokenActions = {
        Program: async (token, state) => {
            // tf.tidy somewhere here
            let stateAcc = Object.create(state)
            const assignments = await forEach_async(token.value, async (assignment) => {
                // is it possible to do merging without mutation?
                const stateDelta = await this.processToken(assignment, stateAcc)
                stateAcc = merge(stateAcc, stateDelta)
                const _m = SYMBOLS.meta
                stateAcc[_m] = merge({}, stateAcc[_m], stateDelta[_m])
            })
            return stateAcc
        },
        // ripe for refactoring
        Assignment: async (token, state) => {

            const path = await this.processToken(token.path, state)
            const value = this.processToken(token.value, state) // do not await value

            const silent = token.silent || false
            const isVariable = token.variable || false

            const exists = has(state, path)
            
            const baseValue = {
                [SYMBOLS.meta]: {
                    [path]: {
                        silent,
                        source: token._source
                    }
                }
            }
            
            if (exists) {
                console.log(`${path.join(".")} exists in`, state)
                const oldValue = await get(state, path)
                const valueIsVariable = oldValue instanceof tf.Variable
                if (valueIsVariable) {
                    const fn = getFunction("Assign")
                    const newValue = call(fn, {
                        tensor: oldValue,
                        value
                    })
                    return set(baseValue, path, newValue)
                } else {
                    throw Error(`Only variables can be reassigned. Use $${path.join(".")}`)
                }
            } else {
                if (isVariable) {
                    const fn = getFunction("Variable")
                    const newValue = call(fn, value)
                    return set(baseValue, path, newValue)
                } else {
                    // when checking value of ref
                    //      if flag or same as provided value
                    //          use state.__proto__ instead for lookup
                    const mu = set(baseValue, path, value)
                    return mu
                }
            }

            throw Error(`This will never happen.`)
        },
        Reference: async (token, state) => {
            const path = await this.processToken(token.value, state)
            const value = await get_async(state, path, null)
            // console.log("Reference",path, value, state)
            if (!value) {
                console.log(Object.keys(state).join(", "))
                throw new Error(`No value for "${path.join(".")}".`)
            }
            return value
        },
        Path: async (token, state) => {
            return token.value
        },
        Function: async (token, state) => {
            const fn = async (arg) => {
                const boundEnv = Object.create(Object.assign(Object.create(state), { [token.argument]: arg }))
                return await this.processToken(token.value, boundEnv)
            }
            return fn
        },
        FunctionApplication: async (token, state) => {
            // <fuckup>
            // when there is no argument for function === only one value (reference)
            // this is a wart at the grammar level
            if (!token.argument) {
                let value = await this.processToken(token.function, state)
                if (!(value instanceof Observable)) {
                    value = of(value)
                }
                return value
            }
            // </fuckup>

            let fn = await this.processToken(token.function, state)
            let value = await this.processToken(token.argument, state)

            if (!(fn instanceof Observable)) {
                fn = of(fn)
            }

            if (!(value instanceof Observable)) {
                value = of(value)
            }

            const result = combineLatest(fn, value).pipe(map(async (v) => {
                return await call(await v[0], await v[1])
            }))
            console.log(result)
            return result
            
            // const result = value.pipe(map(async (v) => await call(fn, await v)))
            // return call(fn, value)
        },
        BinaryOperation: async (token, state) => {
            let a = await this.processToken(token.left, state)
            let b = await this.processToken(token.right, state)
            let fn = operatorToFunction(token.operator, 2)

            if (!(fn instanceof Observable)) {
                fn = of(fn)
            }

            if (!(a instanceof Observable)) {
                a = of(a)
            }

            if (!(b instanceof Observable)) {
                b = of(b)
            }

            console.log(fn, a, b)

            const observable = combineLatest(fn, a, b).pipe(map(async (v) => await call(v[0], {
                a: await v[1],
                b: await v[2]
            })))

            return observable
            // return call(fn, { a, b })


        },
        UnaryOperation: async (token, state) => {
            let value = await this.processToken(token.value, state)
            let fn = operatorToFunction(token.operator, 1)
            if (!(value instanceof Observable)) {
                value = of(value)
            }
            const observable = value.pipe(map(async (v) => await call(fn, await v)))
            return observable

            // return call(fn, value)
        },
        Tensor: async (token, state) => {
            const value = await this.processToken(token.value, state)
            const fn = getFunction("Tensor")
            return call(fn, value)
        },
        TensorLiteral: async (token, state) => {
            return token.value
        },
        Object: async (token, state) => {
            const result = await this.processToken(token.value, Object.create(state))
            return result
        },
        __unknown__: async (token, state) => {
            console.log(token)
            return `Unrecognized token: ${token.type}, rest: ${token}`
        }
    }
    interpret = async (ast, env = {}, issues) => {
        const state = Object.assign(Object.create(runtimeEnvironment), env)
        this.issues = issues
        const result = await this.processToken(ast, state)
        return {
            success: {
                result,
                state
            }
        }
    }
    reportIssue({ source, message, severity = "error" }) {
        const issue = {
            ...source,
            message,
            severity
        }
        this.issues.next(issue)
    }
    processToken = async (token, state) => {
        if (!state) {
            console.error("No state to operate on!")
        }
        // console.log(token)
        const fn = this.tokenActions[token.type] || this.tokenActions.__unknown__
        let result
        try {
            result = await fn(token, state)
        } catch (e) {
            if (token._source) {
                const issue = {
                    // [SYMBOLS.meta]: {},
                    source: token._source,
                    message: e.message,
                    severity: e.severity
                }
                this.reportIssue(issue)
                console.error(e)
                throw new Error(e.message)
                // return new Error(e.message)
            } else {
                console.error(e)
            }

            result = null
        }

        return result
    }
}

// This is basically a reference with top-down name resolution.
export const getFunction = (path, state = runtimeEnvironment) => {
    const passThrough = arg => arg
    const fn = get(state, path, null)
    if (!fn) {
        throw ({
            message: `Function "${name}"?`,
            severity: "error"
        })
    }
    return fn || passThrough
}

/*
**TODO**:
    - memoize maybe?
    - fn should consider only ownProps of arg
    - how to inject dynamic scope?
*/
const call = async (fn, arg) => {
    console.log("call", fn, arg)
    fn = await fn
    arg = await arg

    if (isFunction(fn)) {
        return fn(arg)
    }

    if (isObject(fn)) {
        const isCallable = fn.hasOwnProperty(SYMBOLS.call)

        if (isCallable) {
            return call(fn[SYMBOLS.call], arg)
        }
    }

    console.log(fn)
    throw new Error(`${fn} is not callable.`)
}

export default new Interpreter