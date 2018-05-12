import React, { PureComponent } from "react"

import "./style.sass"

const Unknown = ({ data }) => (
    <div className="WestWorldQuote">
        Doesn't look like anything to me.
        <pre>
            {JSON.stringify(data)}
        </pre>
    </div>
)

export default Unknown