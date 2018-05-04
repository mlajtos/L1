import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"

import TensorVis from "./Tensor"
import Value from "./Value"

import "./style.sass"

export default class extends PureComponent {
    render() {
        const tensors = Object.entries(this.props.data)
            .filter(([key, value]) => (value instanceof tf.Tensor))
            .map(([key, value]) => (
                <Value key={key} name={key}>
                    <TensorVis data={value} />
                </Value>
            ))

        return (
            <div className="tensors">
                { tensors }
            </div>
        )
    }
}