import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

import LinearSpace from "./LinearSpace"
import Ones from "./Ones"
import Zeros from "./Zeros"

const $ = (tensor) => tensor.dataSync()

export default {
    Ones,
    Zeros,
    Eye: size => of(tf.eye($(size)[0])),
    LinearSpace,
}