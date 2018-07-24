import * as tf from "@tensorflow/tfjs-core"
window.tf = tf

import Symbols from "./symbols"

import Mouse from "./modules/Mouse"

import Documentation from "./modules/Documentation"

import Random from "./modules/Random"
import ActivationFunctions from "./modules/ActivationFunctions"
import Trigonometry from "./modules/Trigonometry"
import TensorOperators from "./modules/TensorOperators"
import Arithmetics from "./modules/Arithmetics"
import Generators from "./modules/Generators"
import Reducers from "./modules/Reducers"
import Meta from "./modules/Meta"

export default {
    ...Documentation,

    Empty: {},
    False: false,
    True: true,
    None: undefined,

    ...Meta,
    ...Reducers,
    ...TensorOperators,
    ...Generators,
    ...Random,
    ...ActivationFunctions,
    ...Trigonometry,
    ...Arithmetics,

    ".": ({a, b}) => a[b],

    Mouse
}