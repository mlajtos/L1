import { fromEvent } from "rxjs"
import { map } from "rxjs/operators"

import Symbols from "../symbols"

export default {
    [Symbols.doc]: 
`
# Mouse
Provides mouse coordinates (\`x\` and \`y\`) inside the window.

\`\`\`L1
x: Mouse.x
y: Mouse.y
\`\`\`
`,
    x: fromEvent(window, "mousemove").pipe(map(e => tf.scalar(e.x))),
    y: fromEvent(window, "mousemove").pipe(map(e => tf.scalar(e.y))),
}
