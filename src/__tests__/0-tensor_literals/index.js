import * as tf from "@tensorflow/tfjs"
import assert from "assert"

import Evaluator from "../../components/Evaluator"

const source = `
a: 1
`

const evaluationResult = Evaluator.evaluateSync(source)
const actual = evaluationResult.computedValues

const expected = {
    a: tf.scalar(1)
}

assert.equal(
    actual.a.dataSync().toString(),
    expected.a.dataSync().toString(),
    "Equality of a scalar literal"
)

