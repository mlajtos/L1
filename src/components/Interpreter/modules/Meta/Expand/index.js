import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"

import Symbols from "../../../symbols"

import doc from "./doc.md"

export default {
    [Symbols.call]: (axis) => {
        const axis_native = axis.dataSync()[0]

        return of({
            [Symbols.call]: (tensor) => of(tf.expandDims(tensor, axis_native)),
            [Symbols.doc]: `# Expander
Expands axis ${axis_native} of provided tensor
\`\`\`L1
expander: Expand ${axis_native}
a: RandomNormal [20 20] -> expander
\`\`\`
`
        })
    },
    [Symbols.doc]: doc
}