import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

import LinearSpace from "./LinearSpace"
import Ones from "./Ones"

const $ = (tensor) => tensor.dataSync()

export default {
    Ones,
    Zeros: shape => of(tf.zeros($(shape))),
    Eye: size => of(tf.eye($(size)[0])),
    LinearSpace,
}