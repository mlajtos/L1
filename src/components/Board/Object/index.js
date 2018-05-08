import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"
import { isObject, isFunction } from "lodash"

import TensorVis from "../Tensor"
import Value from "../Value"

import "./style.sass"

const UnknownVis = () => <div className="WestWorldQuote">Doesn't look like anything to me.</div>
const FunctionVis = () => <div className="SophiaLorenQuote">Spaghetti can be eaten most successfully if you inhale it like a vacuum cleaner.</div>

const getTypeAndComponent = (value) => {
    if (value instanceof tf.Tensor) {
        return {
            type: "tensor",
            literal: "[]",
            Component: TensorVis
        }
    }

    if (isFunction(value)) {
        return {
            type: "function",
            literal: "λ => λ",
            Component: FunctionVis
        }
    }

    if (isObject(value)) {
        return {
            type: "object",
            literal: "{}",
            Component: ObjectVis
        }
    }


    return {
        type: "unknown",
        literal: "",
        Component: UnknownVis
    }
}

export default class ObjectVis extends PureComponent {
    render() {
        const props = Object.entries(this.props.data)
            .map(([key, value]) => {
                const { type, literal, Component } = getTypeAndComponent(value)
                console.log(value, Component)
                return (
                    <Value key={key} name={key} type={type} literal={literal}>
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