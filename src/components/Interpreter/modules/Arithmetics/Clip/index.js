import * as tf from "@tensorflow/tfjs"
import { of } from "rxjs"
import { isObject } from "lodash-es"

import Symbols from "../../../symbols"

import doc from "./doc.md"

const $ = (tensor) => tensor.dataSync()[0]

export default {
    [Symbols.doc]: doc,
    [Symbols.call]: (arg) => {
        if (arg === undefined) {
            return of({
                [Symbols.doc]: `
# Clipper
Clips values to interval \`0\` – \`1\`
\`\`\`L1
clipper: Clip !
a: RandomNormal [10 10] -> clipper
\`\`\`
                `,
                [Symbols.call]: tensor => of(tf.maximum(tf.minimum(tensor, 1), 0))
            })
        }
        if (isObject(arg)) {
            const { min, max } = {...arg}

            return of({
                [Symbols.doc]: `
# Clipper
Clips values to provided \`min\` and \`max\`
\`\`\`L1
clipper: Clip {${ min ? "\n    min: " + $(min) : ""}${ max ? "\n    max: " + $(max) : ""}
}
a: RandomNormal [10 10] -> clipper
\`\`\`
                `,
                [Symbols.call]: tensor => {
                    if (max && max instanceof tf.Tensor) {
                        tensor = tf.minimum(tensor, max)
                    }
                    if (min && min instanceof tf.Tensor) {
                        tensor = tf.maximum(tensor, min)
                    }
                    return of(tensor)
                }
            })
        }
    },
}