import runtimeEnvironment from "./runtimeEnvironment"
import * as tf from "@tensorflow/tfjs-core"
import { isPlainObject, isFunction, has, hasIn, set, get, merge, isObject } from "lodash-es"
import { Subject } from "rxjs"

import { OPERATORS } from "./operators"

const SYMBOLS = {
    meta: Symbol.for("meta"),
    dispatch: "dispatch"//Symbol.for("dispatch")
}

const forEach_async = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const get_async = async (object, path, defaultValue) => {
    let index = 0
    const length = path.length
  
    while (object != null && index < length) {
      object = await object[path[index++]]
    }
    return (index && index == length) ? object : defaultValue
}

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
            if (!token.argument) {
                // when does this happen?
                const value = await this.processToken(token.function, state)
                return value
            }
            const fn = await this.processToken(token.function, state)
            const value = await this.processToken(token.argument, state)
            return call(fn, value)
        },
        BinaryOperation: async (token, state) => {
            const a = await this.processToken(token.left, state)
            const b = await this.processToken(token.right, state)
            const fn = operatorToFunction(token.operator, 2)
            return call(fn, { a, b })
        },
        UnaryOperation: async (token, state) => {
            const value = await this.processToken(token.value, state)
            const fn = operatorToFunction(token.operator, 1)
            return call(fn, value)
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
                return new Error(e.message)
            } else {
                console.error(e)
            }

            result = null
        }

        return result
    }
}

const getFunction = (path, state = runtimeEnvironment) => {
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

const operatorToFunction = (operator, arity) => {
    if (!arity) {
        console.error(`Missing "arity" argument for operator "${operator}".`)
    }
    const functionName = OPERATORS[arity][operator]
    if (!functionName) {
        console.error(`Operator "${operator}" does not have an associated function.`)
    }
    const fn = getFunction(functionName)
    return fn
}

// Object.prototype.hasOwnPropertySymbol = function(symbol) {
//     return (symbol in Object.getOwnPropertySymbols())
// }
// TODO: memoize maybe?
const call = async (fn, arg) => {
    fn = await fn
    arg = await arg

    // TODO: fn should consider only ownProps of arg
    // TODO: how to inject dynamic scope?

    if (isFunction(fn)) {
        return fn(arg)
    }

    if (isObject(fn)) {
        const hasDispatch = fn.hasOwnProperty(SYMBOLS.dispatch)

        if (hasDispatch) {
            return call(fn[SYMBOLS.dispatch], arg)
        }
    }

    throw new Error(`${fn} is not callable.`)
}

export default new Interpreter