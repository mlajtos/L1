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
import Trigonometry from "./modules/Trigonometry"
import TensorOperators from "./modules/TensorOperators"
import Arithmetics from "./modules/Arithmetics"
import Generators from "./modules/Generators"

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
    
    ...TensorOperators,
    ...Generators,
    ...Random,
    ...ActivationFunctions,
    ...Trigonometry,
    ...Arithmetics,

    ".": ({a, b}) => a[b],

    Mouse
}