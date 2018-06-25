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

const binarize = (fn) => (({ a, b }) => fn(a, b))

export default {
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

    ".": binarize((a, b) => a[b]),

    Mouse
}