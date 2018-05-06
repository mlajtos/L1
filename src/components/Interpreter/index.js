import { isString } from "monaco-editor/esm/vs/base/common/types"
import runtimeEnvironment from "./runtimeEnvironment"
//import { compose } from "ramda"
import * as tf from "@tensorflow/tfjs"
import { isPlainObject, isFunction, hasIn, set, get, merge } from "lodash"

class Interpreter {
    issues = []
    tokenActions = {
        Program: (token, state) => {
            // tf.tidy somewhere here
            const assignments = token.value.map(assignment => this.processToken(assignment, state))
            const mu = assignments.reduce((prev, curr) => merge(prev, curr), {})
            return mu
        },
        // ripe for refactoring
        Assignment: (token, state) => {
            const path = this.processToken(token.path, state)
            const value = this.processToken(token.value, state)
            const exists = hasIn(state, path)
            const isReassignemnt = (token.operator.length > 1)

            if (exists) {
                const oldValue = get(state, path)
                const isVariable = oldValue instanceof tf.Variable
                if (isVariable) {
                    if (isReassignemnt) {
                        const fn = getFunction("Assign")
                        const newValue = call(fn, {
                            tensor: oldValue,
                            value
                        })
                        set(state, path, newValue)
                        return set({}, path, newValue)
                    } else {
                        throw Error(`Use "::"`)
                    }
                } else {
                    throw Error(`Only variables can be reassigned.`)
                }
            } else {
                if (isReassignemnt) {
                    const fn = getFunction("Variable")
                    const newValue = call(fn, value)
                    set(state, path, newValue)
                    return set({}, path, newValue)
                } else {
                    set(state, path, value)
                    return set({}, path, value)
                }
            }

            throw Error(`This will never happen.`)
        },
        Reference: (token, state) => {
            const path = this.processToken(token.value, state)
            const value = get(Object.assign(state, runtimeEnvironment), path, null)
            if (!value) {
                throw new Error(`${path.join(".")}?`)
            }
            return value
        },
        Path: (token, state) => {
            return token.value
        },
        Function: (token, state) => {
            const fn = (arg) => this.processToken(token.value, Object.assign(state, { [token.argument]: arg}))
            return fn
        },
        FunctionApplication: (token, state) => {
            const value = this.processToken(token.argument, state)
            const fn = getFunction(token.functionName, Object.assign(state, runtimeEnvironment))
            return call(fn, value)
        },
        FunctionComposition: (token, state) => {
            const fns = token.list.map(functionName => getFunction(functionName, {...state, ...runtimeEnvironment}))
            const composition = compose(...fns)
            composition(tf.tensor([1, 2, 3, 4])).print()
            console.log(composition, isFunction(isFunction))
            return composition
        },
        BinaryOperation: (token, state) => {
            const a = this.processToken(token.left, state)
            const b = this.processToken(token.right, state)
            const fn = operatorToFunction(token.operator, 2)
            return call(fn, { a, b })
        },
        UnaryOperation: (token, state) => {
            const value = this.processToken(token.value, state)
            const fn = operatorToFunction(token.operator, 1)
            return call(fn, value)
        },
        ImplicitConversion: (token, state) => {
            const value = this.processToken(token.value, state)
            const fn = getFunction("Tensor")
            return call(fn, value)
        },
        Tensor: (token, state) => {
            return token.value
        },
        Object: (token, state) => {
            const result = this.processToken(token.value, Object.create(state)) // TODO do proper hierarchy
            return result
        },
        __unknown__: (token, state) => {
            console.log(token)
            return `Unrecognized token: ${token.type}, rest: ${token}`
        }
    }
    interpret = (ast) => {
        return new Promise(resolve => {
            const result = this.interpretSync(ast)
            resolve(result)
        })
    }
    interpretSync = (ast) => {
        const state = { // shared mutable ;)
            //...runtimeEnvironment
        }
        this.issues = []
        const result = this.processToken(ast, state)
        return {
            success: {
                result,
                issues: [...this.issues],
                state
            }
        }
    }
    reportIssue({ source, message, severity = "error" }) {
        this.issues.push({
            ...source,
            message,
            severity
        })
    }
    processToken = (token, state) => {
        if (!state) {
            console.error("No state to operate on!")
        }
        // console.log(token)
        const fn = this.tokenActions[token.type] || this.tokenActions.__unknown__
        let result
        try {
            result = fn(token, state)
        } catch (e) {
            if (token._source) {
                this.reportIssue({
                    source: token._source,
                    message: e.message,
                    severity: e.severity
                })
            } else {
                console.error(e)
            }

            result = "XXX"
        }

        return result
    }
}

const getFunction = (name, state = runtimeEnvironment) => {
    const found = state.hasOwnProperty(name)
    if (!found) {
        throw ({
            message: `${name}?`,
            severity: "error"
        })
    }
    const passThrough = arg => arg
    const fn = found ? state[name] : passThrough
    return fn
}

const OPERATORS = {
    "1": {
        "'": "ConvertToNative",
        "-": "Negative",
        "/": "Reciprocal"
    },
    "2": {
        "+": "Add",
        "-": "Subtract",
        "*": "Multiply",
        "×": "Multiply",
        "/": "Divide",
        "÷": "Divide",
        "^": "Power",
        "%": "Modulus",
        "@": "MatrixMultiply"
        // TODO: strict versions should be ++, --, **, //, etc. (if they are needed)
    }
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

// TODO: memoize maybe?
const call = (fn, arg) => {
    // console.log(`Call with params: `, args)
    return fn(arg)
}

export default new Interpreter