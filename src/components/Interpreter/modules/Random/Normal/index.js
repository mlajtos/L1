import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"
import { isObject } from "lodash-es"

import Symbols from "../../../symbols"

import doc from "./doc.md"

const $ = (tensor) => tensor.dataSync()

export default {
    RandomNormal: {
        [Symbols.doc]: doc,
        [Symbols.call]: arg => {
            let shape   = tf.scalar(1)
            let mean    = tf.scalar(0)
            let stdDev  = tf.scalar(1)

            if (arg === undefined) {
                return of(tf.scalar($(tf.randomNormal($(shape), $(mean)[0], $(stdDev)[0]))[0]))
            }

            if (arg instanceof tf.Tensor) {
                shape = arg
                return of(tf.randomNormal($(shape), $(mean)[0], $(stdDev)[0]))
            }

            if (!isObject(arg)) {
                throw Error("RandomNormal needs tensor or object")
            }

            if (arg.hasOwnProperty("shape")) {
                shape = arg.shape
            } else {
                throw Error("RandomNormal { shape: ? }")
            }

            if (arg.hasOwnProperty("mean")) {
                mean = arg.mean
            }

            if (arg.hasOwnProperty("stdDev")) {
                stdDev = arg.stdDev
            }

            return of(tf.randomNormal($(shape), $(mean)[0], $(stdDev)[0]))
        }
    }
}