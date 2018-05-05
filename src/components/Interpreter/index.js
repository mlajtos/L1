import { isString } from "monaco-editor/esm/vs/base/common/types"
import runtimeEnvironment from "./runtimeEnvironment"
//import { compose } from "ramda"
import * as tf from "@tensorflow/tfjs"

function isFunction(f) {
    return !!(f && f.constructor && f.call && f.apply);
}

function compose() {
    var fns = Array.prototype.slice.call(arguments)
        ;

    return function() {
        var args = Array.prototype.slice.call(arguments)
            , fn = fns[fns.length-1]
            , i = fns.length - 1 // -1 because the last function is special
            , result = null
            ;

        result = fn.apply(fn, args);
        while (i--) {
            fn = fns[i];
            result = fn.apply(fn, [result]);
        }
        
        return result;
    }
}

class Interpreter {
    issues = []
    tokenActions = {
        Program: (token, state) => {
            // tf.tidy somewhere here
            const assignments = token.value.map(assignment => this.processToken(assignment, state))
            const mu = assignments.reduce((prev, curr) => ({
                ...prev,
                ...curr
            }), {})
            return mu
        },
        Assignment: (token, state) => {
            const path = this.processToken(token.path, state)
            const value = this.processToken(token.value, state)
            state[path] = value

            return {
                [path]: value
            }
        },
        Reference: (token, state) => {
            const reference = this.processToken(token.value, state)
            const referencedValue = getPropertyValue(reference, {...state, ...runtimeEnvironment})
            if (!referencedValue) {
                throw new Error(`Cannot resolve "${reference}".`)
            }
            return referencedValue
        },
        Path: (token, state) => {
            return token.value.join("/") // TODO: do proper hierarchy
        },
        Function: (token, state) => {
            const fn = (arg) => this.processToken(token.value, {...state, [token.argument]: arg})
            return fn
        },
        FunctionApplication: (token, state) => {
            const value = this.processToken(token.argument, state)
            const ffn = getForeignFunction(token.functionName, {...state, ...runtimeEnvironment})
            return call(ffn, value)
        },
        FunctionComposition: (token, state) => {
            const fns = token.list.map(functionName => getForeignFunction(functionName, {...state, ...runtimeEnvironment}))
            const composition = compose(...fns)
            composition(tf.tensor([1, 2, 3, 4])).print()
            console.log(composition, isFunction(isFunction))
            return composition
        },
        BinaryOperation: (token, state) => {
            const a = this.processToken(token.left, state)
            const b = this.processToken(token.right, state)
            const ffn = operatorToFunction(token.operator, 2)
            return call(ffn, { a, b })
        },
        UnaryOperation: (token, state) => {
            const value = this.processToken(token.value, state)
            const ffn = operatorToFunction(token.operator, 1)
            return call(ffn, value)
        },
        ImplicitConversion: (token, state) => {
            const value = this.processToken(token.value, state)
            const ffn = getForeignFunction("Tensor")
            return call(ffn, value)
        },
        Tensor: (token, state) => {
            return token.value
        },
        Object: (token, state) => {
            const result = this.processToken(token.value, state) // TODO do proper hierarchy
            return result
        },
        __unknown__: (token, state) => `Unrecognized token: ${token.type}, rest: ${token}`
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

const getForeignFunction = (name, state = runtimeEnvironment) => {
    // console.log("ForeignFunction:", name)
    const foreignName = name
    const found = state.hasOwnProperty(foreignName)
    if (!found) {
        throw ({
            message: `${foreignName}?`,
            severity: "warning"
        })
    }
    const passThrough = arg => arg
    const foreignFunction = found ? state[foreignName] : passThrough
    return foreignFunction
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
    const fn = getForeignFunction(functionName)
    return fn
}

// TODO: memoize maybe?
const call = (fn, arg) => {
    // console.log(`Call with params: `, args)
    return fn(arg)
}

const getPropertyValue = (property, object) => {
    // console.log(property, Object.keys(object))
    const hasProperty = object.hasOwnProperty(property)
    return hasProperty ? object[property] : null
}

const isPlainObject = (value) => (value && value.toString && value.toString() === "[object Object]")

export default new Interpreter