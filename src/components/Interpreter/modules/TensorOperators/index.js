import * as tf from "@tensorflow/tfjs"

const binarize = (fn) => (({ a, b }) => fn(a, b))

export default {
    "+": binarize(tf.add),
    "-": ({a, b}) => {
        if (a === undefined) {
            return tf.neg(b)
        }
        return tf.sub(a, b)
    },
    "*": ({a, b}) => {
        if (a === undefined) {
            return tf.sign(b)
        }
        return tf.mul(a, b)
    },
    "×": ({a, b}) => {
        if (a === undefined) {
            return tf.sign(b)
        }
        return tf.mul(a, b)
    },
    "/": ({a, b}) => {
        if (a === undefined) {
            return tf.reciprocal(b)
        }
        return tf.div(a, b)
    },
    "÷": ({a, b}) => {
        if (a === undefined) {
            return tf.reciprocal(b)
        }
        return tf.div(a, b)
    },
    "^": binarize(tf.pow),
    "%": binarize(tf.mod),
    "@": binarize(tf.matMul),
    "⊗": binarize(tf.matMul),
}