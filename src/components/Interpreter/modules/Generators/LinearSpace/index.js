import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

import doc from "./doc.md"

const $ = (tensor) => tensor.dataSync()[0]

export default {
    [Symbol.for("doc")]: doc,
    [Symbol.for("call")]: arg => {
        if (arg === undefined) {
            return of(tf.linspace(0, 1, 2))
        }

        const start = arg.hasOwnProperty("start") ? $(arg.start) : 0
        const stop = arg.hasOwnProperty("stop") ? $(arg.stop) : 1
        const count = arg.hasOwnProperty("count") ? $(arg.count) : 2

        return of(tf.linspace(start, stop, count))
    }
}