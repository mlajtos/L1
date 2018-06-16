import * as tf from "@tensorflow/tfjs-core"

import Symbols from "../../symbols"


import doc from "./doc.md"

export default {
    [Symbols.call]: (tensor) => tf.min(tensor),
    [Symbols.doc]: doc
}