import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

import doc from "./doc.md"

const $ = (tensor) => tensor.dataSync()

export default {
    [Symbol.for("doc")]: doc,
    [Symbol.for("call")]: shape => {
        if (shape === undefined) {
            return of(tf.ones([]))
        }

        return of(tf.ones($(shape)))
    }
}