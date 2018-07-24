import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"

import Symbols from "../../../symbols"


import doc from "./doc.md"

export default {
    [Symbols.call]: (tensor) => of(tf.tensor(tensor.size)),
    [Symbols.doc]: doc
}