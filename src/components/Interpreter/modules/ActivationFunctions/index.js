import * as tf from "@tensorflow/tfjs-core"
import { of } from "rxjs"

import Symbols from "../../symbols"

const doc_relu =
`# Rectified Linear Unit

Replaces negative values with zero.

\`\`\`L1
a: RectifiedLinearUnit [-1 0 1] ; [0 0 1]
\`\`\`
`

export default {
    RectifiedLinearUnit: {
        [Symbols.doc]: doc_relu,
        [Symbols.call]: arg => of(tf.relu(arg))
    },

    ExponentialLinearUnit: {
        [Symbols.doc]: `# Exponential Linear Unit`,
        [Symbols.call]: arg => of(tf.elu(arg))
    },
    
    Sine: {
        [Symbols.doc]: `# Sine`,
        [Symbols.call]: arg => of(tf.sin(arg))
    },
    
    Logarithm: {
        [Symbols.doc]: `# Logarithm`,
        [Symbols.call]: arg => of(tf.log(arg))
    }
}