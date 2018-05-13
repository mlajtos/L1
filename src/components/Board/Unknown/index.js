import React, { PureComponent } from "react"

import PropertyWrapper from "../PropertyWrapper"

import "./style.sass"

const Unknown = (props) => (
    <PropertyWrapper {...props} type="unknown">
        {/* <div className="WestWorldQuote">
            Doesn't look like anything to me.
            <pre>
                {JSON.stringify(props.data)}
            </pre>
        </div> */}
    </PropertyWrapper>
)

export default Unknown