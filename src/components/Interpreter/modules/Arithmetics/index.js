import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"

import Clip from "./Clip"

export default {
    Square: a => of(tf.square(a)),
    SquareRoot: a => of(tf.sqrt(a)),
    Sign: a => of(tf.sign(a)),
    Floor: a => of(tf.floor(a)),
    Ceiling: a => of(tf.ceil(a)),
    Round: a => of(tf.round(a)),
    Absolute: a => of(tf.abs(a)),
    Logarithm: a => of(tf.log(a)),
    Clip
}