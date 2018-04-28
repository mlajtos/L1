const semantics = {
    operation: "eval",
    actions: {
        Program: function(data) {
            return {
                type: "Program",
                value: data.eval()
            }
        },
        Assignment_function: function(p, _, v) {
            const path = p.eval()
            const value = v.eval()
            return {
                type: "Assignment",
                path: {
                    type: "Path",
                    value:[path]
                },
                value
            }
        },
        Assignment_value: function(p, _, v, __) {
            const path = p.eval()
            const value = v.eval()
            return {
                type: "Assignment",
                path,
                value
            }
        },
        BackwardChain: function(functionName, argument) {
            return {
                type: "FunctionApplication",
                direction: "backward",
                functionName: functionName.eval(),
                argument: argument.eval()
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
                type: "Tensor",
                rank: 2,
                value: data.eval()
            }
        },
        Vector: function(_, data, __) {
            return {
                type: "Tensor",
                rank: 1,
                value: data.eval()
            }
        },
        Scalar: function(data) {
            return {
                type: "Tensor",
                rank: 0,
                value: data.eval()
            }
        },
        // Ohm, why are you like this?
        Addition_binary: function(l, op, r) { return binaryOperation(l, op, r) },
        Multiplication_binary: function(l, op, r) { return binaryOperation(l, op, r) },
        Exponentiation_binary: function(l, op, r) { return binaryOperation(l, op, r) },
        PrimitiveExpression_literal: function(value) {
            return {
                type: "ImplicitConversion",
                value: value.eval()
            }
        },
        PrimitiveExpression_negative: function(op, v) { return unaryOperation(op, v) },
        PrimitiveExpression_reciprocal: function(op, v) { return unaryOperation(op, v) },
        PrimitiveExpression_magic: function(op, v) { return unaryOperation(op, v) },
        PrimitiveExpression_paren: function(_, v, __) { return v.eval() },
        Reference: function(path) {
            return {
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
        functionName: function(_, __) {
            return this.sourceString
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

const unaryOperation = (op, value) => ({
    type: "UnaryOperation",
    operator: op.sourceString,
    value: value.eval()
})

const binaryOperation = (left, op, right) => ({
    type: "BinaryOperation",
    operator: op.sourceString,
    left: left.eval(),
    right: right.eval()
})

export default semantics