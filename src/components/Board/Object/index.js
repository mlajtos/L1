import React, { PureComponent } from "react"

import ObjectProperty from "../ObjectProperty"
import PropertyWrapper from "../PropertyWrapper"

import "./style.sass"

const _m = Symbol.for("meta")

export default class ObjectVis extends PureComponent {
    render() {
        const { data } = this.props
        // console.log("ObjectVis", data)

        const props = Object.entries(data)
            .filter(([key]) => !data[_m][key].suppress)
            .map(([key, value]) => {
                const _meta = data[_m][key]

                return (
                    <ObjectProperty {...{
                        key,
                        name: key,
                        data: value,
                        _meta
                    }} />
                )
            })

        return (
            <PropertyWrapper {...this.props} type="object">
                <div className="properties">
                    {props}
                </div>
            </PropertyWrapper>
        )
    }
}