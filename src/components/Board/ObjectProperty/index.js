import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs-core"
import { isObject, isFunction, stubTrue } from "lodash-es"
import { Observable } from "rxjs"

import TensorVis from "../Tensor"
import ScalarVis from "../Scalar"
import FunctionVis from "../Function"
import UnknownVis from "../Unknown"
import PromiseVis from "../Promise"
import ObservableVis from "../Observable"
import ObjectVis from "../Object"
import ErrorVis from "../Error"

const isUndefined = (value) => !value
const isPromise = (value) => (value.toString() === "[object Promise]")
const isTensor = (value) => value instanceof tf.Tensor
const isScope = (value) => (isObject(value) && !isPromise(value))
const isError = (value) => value instanceof Error
const isObservable = (value) => value instanceof Observable

export default class ObjectProperty extends PureComponent {
    visualizations = [
        [isUndefined,   UnknownVis    ],
        [isError,       ErrorVis      ],
        [isTensor,      TensorVis     ],
        [isFunction,    FunctionVis   ],
        [isObservable,  ObservableVis ],
        [isScope,       ObjectVis     ],
        [isPromise,     PromiseVis    ],
        [stubTrue,      UnknownVis    ],
    ]
    valueToVis = value => this.visualizations.find(([cond, result]) => cond(value))[1]
    render() {
        const Component = this.valueToVis(this.props.data)
        return (
            <Component {...this.props} />
        )
    }
}