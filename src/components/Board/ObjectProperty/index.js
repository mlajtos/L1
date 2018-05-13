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
        // console.log(value)

        if (!value) {
            // console.log("unknown")
            return UnknownVis
        }
        
        if (value instanceof tf.Tensor) {
            // console.log("tensor")
            return TensorVis
        } else
        if (isFunction(value)) {
            // console.log("function")
            return FunctionVis
        } else
        if (isObject(value) && !isPromise(value)) {
            // console.log("object")
            return ObjectVis
        } else
        if (isPromise(value)) {
            // console.log("promise")
            return PromiseVis
        } else {
            // console.log("last unknown")
            return UnknownVis
        }
    }
    render() {
        const Component = this.valueToVis(this.props.data)
        // console.log("Props", this.props)
        // console.log("Component", Component)
        return <Component {...this.props} />
    }
}