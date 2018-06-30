import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"
import { isObject } from "lodash-es"

import Symbols from "../../../symbols"

import doc from "./doc.md"

const $ = (tensor) => tensor.dataSync()

export default {
    RandomUniform: {
        [Symbols.doc]: doc,
        [Symbols.call]: arg => {
            let shape   = tf.scalar(1)
            let min     = tf.scalar(0)
            let max     = tf.scalar(1)

            if (arg === undefined) {
                return of(tf.scalar($(tf.randomUniform($(shape), $(min)[0], $(max)[0]))[0]))
            }

            if (arg instanceof tf.Tensor) {
                shape = arg
                return of(tf.randomUniform($(shape), $(min)[0], $(max)[0]))
            }

            if (!isObject(arg)) {
                throw Error("RandomUniform needs tensor or object")
            }

            if (arg.hasOwnProperty("shape")) {
                shape = arg.shape
            } else {
                throw Error("RandomUniform { shape: ? }")
            }

            if (arg.hasOwnProperty("min")) {
                mean = arg.min
            }

            if (arg.hasOwnProperty("max")) {
                stdDev = arg.max
            }

            return of(tf.randomUniform($(shape), $(min)[0], $(max)[0]))
        }
    }
}