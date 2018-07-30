import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

import doc from "./doc.md"

const $ = (tensor) => tensor.dataSync()[0]

export default {
    [Symbol.for("doc")]: doc,
    [Symbol.for("call")]: arg => {
        if (arg === undefined) {
            return of(tf.scalar(1))
        }

        return of(tf.eye($(arg)))
    }
}