import { convertToLineNumberAndColumn } from "./index"
import { isEmpty } from "lodash-es"

const semantics = {
    operation: "eval",
    actions: {
        Program: function(data) {
            return {
                ...includeSource(this.source),
                type: "Program",
                value: data.eval()
            }
        },
        Assignment_normal: function(f1, p, o, v, __) {
            const silent = (f1.sourceString === "_")

            const path = p.eval()
            const value = v.eval()
            return {
                ...includeSource(this.source),
                type: "Assignment",
                path,
                value,
                silent
            }
        },
        Assignment_import: function(_, p, __) {
            const path = p.eval()
            return {
                ...includeSource(this.source),
                type: "Assignment",
                path: {
                    ...includeSource(this.source),
                    type: "Path",
                    value: [path.value.slice(-1).pop()]
                },
                value: {
                    ...includeSource(this.source),
                    type: "Reference",
                    value: path
                }
            }
        },
        FunctionApplication: function(fn, arg) {
            arg = arg.eval()
            fn = fn.eval()

            if (isEmpty(arg)) {
                return fn
            }

            return {
                ...includeSource(this.source),
                type: "FunctionApplication",
                direction: "backward",
                function: fn,
                argument: arg[0]
            }
        },
        Pipeline_binary: function (arg, _, fn) {
            let argument = arg.eval()
            return {
                ...includeSource(this.source),
                type: "FunctionApplication",
                direction: "forward",
                function: fn.eval(),
                argument
            }
        },
        Path: function(mu) {
            return {
                ...includeSource(this.source),
                type: "Path",
                value: mu.eval()
            }
        },
        Function: function(argument, _, value) {
            return {
                ...includeSource(this.source),
                type: "Function",
                argument: argument.eval(),
                value: value.eval()
            }
        },
        Object: function(_, data, __) {
            return {
                ...includeSource(this.source),
                type: "Object",
                value: data.eval()
            }
        },
        Matrix: function(_, data, __) {
            return {
                ...includeSource(this.source),
                type: "TensorLiteral",
                rank: 2,
                value: data.eval()
            }
        },
        Vector: function(_, data, __) {
            return {
                ...includeSource(this.source),
                type: "TensorLiteral",
                rank: 1,
                value: data.eval()
            }
        },
        Scalar: function(data) {
            return {
                ...includeSource(this.source),
                type: "TensorLiteral",
                rank: 0,
                value: data.eval()
            }
        },
        // Ohm, why are you like this?
        Addition_binary: function(l, op, r) { return binaryOperation(l, op, r, this.source) },
        Multiplication_binary: function(l, op, r) { return binaryOperation(l, op, r, this.source) },
        Exponentiation_binary: function(l, op, r) { return binaryOperation(l, op, r, this.source) },
        Access_binary: function(l, op, r) { return binaryOperation(l, op, r, this.source) },
        PrimitiveExpression_tensor: function(value) {
            return {
                ...includeSource(this.source),
                type: "Tensor",
                value: value.eval()
            }
        },
        Addition_negative: function(op, v) { return unaryOperation(op, v, this.source) },
        Multiplication_reciprocal: function(op, v) { return unaryOperation(op, v, this.source) },
        PrimitiveExpression_magic: function(op, v) { return unaryOperation(op, v, this.source) },
        PrimitiveExpression_paren: function(_, v, __) { return v.eval() },
        PrimitiveExpression_none1: function(_, __) {
            return {
                ...includeSource(this.source),
                ...None
            }
        },
        PrimitiveExpression_none2: function(_) {
            return {
                ...includeSource(this.source),
                ...None
            }
        },
        PrimitiveExpression_emptyTensor: function(_, __) {
            return {
                ...includeSource(this.source),
                type: "Tensor",
                value: {
                    type: "TensorLiteral",
                    rank: 0,
                    value: []
                }
            }
        },
        Reference: function(path) {
            return {
                ...includeSource(this.source),
                type: "Reference",
                value: path.eval()
            }
        },
        row: function(_, data, __) {
            return data.eval()
        },
        rows: function(data) {
            return data.eval()
        },
        identifier: function(_, __) {
            return this.sourceString
        },
        symbol: function(_, identifier) {
            return Symbol.for(identifier.eval())
        },
        number: function(_, __, ___, ____) {
            const v = this.sourceString.replace(/_/g, "")
            return parseFloat(v, 10)
        },
        string: function(_, value, __) {
            return {
                ...includeSource(this.source),
                type: "String",
                value: value.sourceString
            }
        },
        nonemptyListOf: function(x, _, xs) {
            return [x.eval()].concat(xs.eval())
        }
    }
}

const unaryOperation = (op, value, source) => ({
    ...includeSource(source),
    type: "Operation",
    operator: op.sourceString,
    left: None,
    right: value.eval()
})

const binaryOperation = (left, op, right, source) => ({
    ...includeSource(source),
    type: "Operation",
    operator: op.sourceString,
    left: left.eval(),
    right: right.eval()
})

const includeSource = (source) => ({
    _source: convertToLineNumberAndColumn(source.sourceString, source.startIdx, source.endIdx)
})

const None = {
    type: "None"
}

const EmptyTensor = {
    type: "Tensor"
}

export default semantics