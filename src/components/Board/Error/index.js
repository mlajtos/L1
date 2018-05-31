import React from "react"

import PropertyWrapper from "../PropertyWrapper"

import "./style.sass"

export default (props) => (
    <PropertyWrapper {...props} type="error" symbol="🚫">
        <div className="error-content">{props.data.message}</div>
    </PropertyWrapper>
)