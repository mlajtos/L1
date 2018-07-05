import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"

import Symbols from "../../symbols"

export default {
    Sine: a => of(tf.sin(a)),
    Cosine: a => of(tf.cos(a)),
    Tangent: a => of(tf.tan(a)),
    ArcusSine: a => of(tf.asin(a)),
    ArcusCosine: a => of(tf.acos(a)),
    ArcusTangent: a => of(tf.atan(a)),
}