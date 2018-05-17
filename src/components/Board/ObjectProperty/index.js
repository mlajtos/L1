import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs-core"
import { isObject, isFunction, stubTrue } from "lodash-es"

import TensorVis from "../Tensor"
import ScalarVis from "../Scalar"
import FunctionVis from "../Function"
import UnknownVis from "../Unknown"
import PromiseVis from "../Promise"
import ObjectVis from "../Object"

const isUndefined = (value) => !value
const isPromise = (value) => (value.toString() === "[object Promise]")
const isTensor = (value) => value instanceof tf.Tensor
const isScope = (value) => (isObject(value) && !isPromise(value))

export default class ObjectProperty extends PureComponent {
    visualizations = [
        [isUndefined,   UnknownVis  ],
        [isTensor,      TensorVis   ],
        [isFunction,    FunctionVis ],
        [isScope,       ObjectVis   ],
        [isPromise,     PromiseVis  ],
        [stubTrue,      UnknownVis  ],
    ]
    valueToVis = value => this.visualizations.find(([cond, result]) => cond(value))[1]
    render() {
        const Component = this.valueToVis(this.props.data)
        return (
            <Component {...this.props} />
        )
    }
}