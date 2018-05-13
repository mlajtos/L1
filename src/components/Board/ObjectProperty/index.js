import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"
import { isObject, isFunction } from "lodash"

import TensorVis from "../Tensor"
import ScalarVis from "../Scalar"
import FunctionVis from "../Function"
import UnknownVis from "../Unknown"
import PromiseVis from "../Promise"
import ObjectVis from "../Object"

const isPromise = (value) => (value.toString() === "[object Promise]")

export default class ObjectProperty extends PureComponent {
    valueToVis = value => {
        if (!value) {
            return UnknownVis
        } else
        if (value instanceof tf.Tensor) {
            return TensorVis
        } else
        if (isFunction(value)) {
            return FunctionVis
        } else
        if (isObject(value) && !isPromise(value)) {
            return ObjectVis
        } else
        if (isPromise(value)) {
            return PromiseVis
        } else {
            return UnknownVis
        }
    }
    render() {
        const Component = this.valueToVis(this.props.data)
        return (
            <Component {...this.props} />
        )
    }
}