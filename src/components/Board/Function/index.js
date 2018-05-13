import React from "react"

import PropertyWrapper from "../PropertyWrapper"

import "./style.sass"

export default (props) => (
    <PropertyWrapper {...props}>
        <div className="function-content">λ</div>
    </PropertyWrapper>
)