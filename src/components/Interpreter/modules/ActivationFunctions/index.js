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

    Sigmoid: {
        [Symbols.doc]: `# Sigmoid`,
        [Symbols.call]: arg => of(tf.sigmoid(arg))
    },

    Softmax: {
        [Symbols.doc]: `# Softmax`,
        [Symbols.call]: arg => of(tf.softmax(arg))
    },

    Softplus: {
        [Symbols.doc]: `# Softplus`,
        [Symbols.call]: arg => of(tf.softplus(arg))
    }
}