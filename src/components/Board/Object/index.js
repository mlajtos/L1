import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"
import { isObject, isFunction } from "lodash"

import TensorVis from "../Tensor"
import ScalarVis from "../Scalar"
import FunctionVis from "../Function"
import Property from "../Property"

import "./style.sass"

const _m = Symbol.for("meta")

const UnknownVis = () => (
    <div className="WestWorldQuote">
        Doesn't look like anything to me.
    </div>
)

class Deferred extends PureComponent {
    state = {
        value: undefined
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const newData = nextProps.data
        const currData = prevState.data

        if (newData === currData) {
            return null
        }

        if (newData instanceof Promise) {
            return {
                value: newData
            }
        }
    }

    componentDidMount() {
        this.handlePromise()
    }

    componentDidUpdate(prevProps) {
        this.handlePromise()
    }

    handlePromise() {
        if (this.state.value instanceof Promise) {
            this.state.value.then(this.resolve)
        }
    }

    resolve = (value) => {
        this.setState({ value })
    }

    render() {
        const value = this.state.value

        if (value instanceof Promise) {
            return (
                <div>
                    ...
                </div>
            )
        } else {
            const { type, literal, Component } = getTypeAndComponent(value)
            return (
                <Component data={value} />
            )
        }
    }
}

const getTypeAndComponent = (value) => {
    if (value instanceof tf.Tensor) {
        let isVariable = value instanceof tf.Variable

        if (value.rank === 0) {
            return {
                type: "tensor",
                literal: (isVariable ? "~" : "") + "[]",
                Component: ScalarVis
            }
        }
        return {
            type: "tensor",
            literal: (isVariable ? "~" : "") + "[]",
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

    if (value instanceof Promise) {
        return {
            type: "object",
            literal: "?",
            Component: Deferred
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
        const { data } = this.props

        // console.log("ObjectVis", JSON.stringify(data), Object.entries(data))
        
        const props = Object.entries(data)
            .map(([key, value]) => {
                const meta = data[_m][key]
                const { type, literal, Component } = getTypeAndComponent(value)

                if (meta.suppress) {
                    return null
                }

                return (
                    <Property key={key} name={key} type={type} literal={literal} source={meta.source}>
                        <Component data={value} />
                    </Property>
                )
            })

        return (
            <div className="properties">
                {props}
            </div>
        )
    }
}