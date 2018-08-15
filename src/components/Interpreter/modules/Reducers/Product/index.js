import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"

import Symbols from "../../../symbols"

import doc from "./doc.md"

export default {
    [Symbols.call]: (tensor) => {
        if (tf.prod) {
            return of(tf.prod(tensor))
        } else {
            return of(new Error("TensorFlow.js does not support tf.prod()."))
        }
    },
    [Symbols.doc]: doc
}