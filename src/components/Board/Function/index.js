import React from "react"

import PropertyWrapper from "../PropertyWrapper"

import "./style.sass"

export default (props) => (
    <PropertyWrapper {...props} type="function" symbol="λ => λ">
        <div className="function-content">λ</div>
    </PropertyWrapper>
)