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

import Random from "./modules/Random"
import ActivationFunctions from "./modules/ActivationFunctions"

const binarize = (fn) => (({ a, b }) => fn(a, b))

export default {
    [Symbols.doc]: `Hello.`,

    Empty: {},
    False: false,
    True: true,
    None: undefined,

    Shape,
    Size,
    Rank,
    Mean,
    Min,
    Max,

    ...Random,
    ...ActivationFunctions,

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

    ".": binarize((a, b) => a[b]),

    Mouse
}