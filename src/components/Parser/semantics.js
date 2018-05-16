import { convertToLineNumberAndColumn } from "./index"

const semantics = {
    operation: "eval",
    actions: {
        Program: function(data) {
            return {
                type: "Program",
                value: data.eval()
            }
        },
        Assignment_normal: function(f1, f2, p, o, v, __) {
            const silent = (f1.sourceString === "_")
            const variable = (f2.sourceString === "$")
            const path = p.eval()
            const value = v.eval()
            return {
                ...includeSource(this.source),
                type: "Assignment",
                path,
                value,
                silent,
                variable
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
            let argument = arg.eval()
            argument = argument === [] ? null : argument[0]
            return {
                ...includeSource(this.source),
                type: "FunctionApplication",
                direction: "backward",
                function: fn.eval(),
                argument
            }
        },
        Path: function(mu) {
            return {
                type: "Path",
                value: mu.eval()
            }
        },
        Function: function(argument, _, value) {
            return {
                type: "Function",
                argument: argument.eval(),
                value: value.eval()
            }
        },
        Object: function(_, data, __) {
            return {
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
        number: function(_, __, ___, ____) {
            const v = this.sourceString.replace(/_/g, "")
            return parseFloat(v, 10)
        },
        nonemptyListOf: function(x, _, xs) {
            return [x.eval()].concat(xs.eval())
        }
    }
}

const unaryOperation = (op, value, source) => ({
    ...includeSource(source),
    type: "UnaryOperation",
    operator: op.sourceString,
    value: value.eval()
})

const binaryOperation = (left, op, right, source) => ({
    ...includeSource(source),
    type: "BinaryOperation",
    operator: op.sourceString,
    left: left.eval(),
    right: right.eval()
})

const includeSource = (source) => ({
    _source: convertToLineNumberAndColumn(source.sourceString, source.startIdx, source.endIdx)
})

export default semantics