import * as tf from "@tensorflow/tfjs-core"

import Symbols from "../../symbols"


import doc from "./doc.md"

export default {
    [Symbols.call]: (tensor) => tf.max(tensor),
    [Symbols.doc]: doc
}