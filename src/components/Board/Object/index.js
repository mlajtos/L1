import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"
import { isPlainObject, isFunction } from "lodash"

import TensorVis from "../Tensor"
import Value from "../Value"

import "./style.sass"

const getTypeAndComponent = (value) => {
    if (value instanceof tf.Tensor) {
        return ["tensor", TensorVis]
    }

    if (isPlainObject(value)) {
        return ["object", ObjectVis]
    }

    if (isFunction(value)) {
        return ["function", () => <div>"Graph"</div>]
    }

    return ["unknown", () => <div>No idea</div>]
}

export default class ObjectVis extends PureComponent {
    render() {
        const props = Object.entries(this.props.data)
            .map(([key, value]) => {
                const [type, Component] = getTypeAndComponent(value)
                return (
                    <Value key={key} name={key} type={type}>
                        <Component data={value} />
                    </Value>
                )
            })

        return (
            <div className="properties">
                {props}
            </div>
        )
    }
}