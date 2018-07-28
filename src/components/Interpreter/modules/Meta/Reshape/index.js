import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"

import Symbols from "../../../symbols"

import doc from "./doc.md"

export default {
    [Symbols.call]: (shape) => {
        const shape_native = shape.dataSync()
        // const size = shape.prod()
        const size = shape_native.reduce((a, c) => a * c)
        const shape_string = "[" + shape_native.join(" ") + "]"

        return of({
            [Symbols.call]: (tensor) => of(tf.reshape(tensor, shape_native)),
            [Symbols.doc]: `# Reshaper
Reshapes tensor to ${shape_string}
\`\`\`L1
reshaper: Reshape ${shape_string}
a: RandomNormal ${size} -> reshaper
\`\`\`
`
        })
    },
    [Symbols.doc]: doc
}