import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

const $ = (tensor) => tensor.dataSync()

export default {
    Ones: shape => of(tf.ones($(shape))),
    Zeros: shape => of(tf.zeros($(shape))),
    Eye: size => of(tf.eye($(size)[0])),
    LinearSpace: arg => {
        const start = arg.hasOwnProperty("start") ? $(arg.start)[0] : 0
        const stop = arg.hasOwnProperty("stop") ? $(arg.stop)[0] : 1
        const count = arg.hasOwnProperty("count") ? $(arg.count)[0] : 10

        return of(tf.linspace(start, stop, count))
    }
}