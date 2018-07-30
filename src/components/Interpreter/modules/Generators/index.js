import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

import LinearSpace from "./LinearSpace"

const $ = (tensor) => tensor.dataSync()

export default {
    Ones: shape => of(tf.ones($(shape))),
    Zeros: shape => of(tf.zeros($(shape))),
    Eye: size => of(tf.eye($(size)[0])),
    LinearSpace,
}