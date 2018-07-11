import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs-core"
import { isObject, isFunction, stubTrue, isString, isNumber, isBoolean } from "lodash-es"
import { Observable } from "rxjs"

import TensorVis from "../Tensor"
import ScalarVis from "../Scalar"
import FunctionVis from "../Function"
import UnknownVis from "../Unknown"
import PromiseVis from "../Promise"
import ObservableVis from "../Observable"
import ObjectVis from "../Object"
import ErrorVis from "../Error"

import PropertyWrapper from "../PropertyWrapper"

const isUndefined = (value) => (value === undefined)
const isNull = (value) => (value === null)
const isPromise = (value) => (value.toString() === "[object Promise]")
const isTensor = (value) => value instanceof tf.Tensor
const isScope = (value) => (isObject(value) && !isPromise(value))
const isError = (value) => value instanceof Error
const isObservable = (value) => value instanceof Observable

const StringVis = (props) => (
    <PropertyWrapper {...props} type="string" symbol={"\"abc\""}>
        <div>{props.data}</div>
    </PropertyWrapper>
)

const NumberVis = (props) => (
    <PropertyWrapper {...props} type="number" symbol="123">
        <div>{props.data}</div>
    </PropertyWrapper>
)

const BooleanVis = (props) => (
    <PropertyWrapper {...props} type="boolean" symbol="0/1">
        <div>{props.data ? "True" : "False"}</div>
    </PropertyWrapper>
)

const UndefinedVis = (props) => (
    <PropertyWrapper {...props} type="undefined" symbol="()">
    </PropertyWrapper>
)

const NullVis = (props) => (
    <PropertyWrapper {...props} type="null" symbol="NULL" />
)

export default class ObjectProperty extends PureComponent {
    visualizations = [
        [isUndefined,   UndefinedVis  ],
        [isNull,        NullVis       ],
        [isBoolean,     BooleanVis    ],
        [isError,       ErrorVis      ],
        [isString,      StringVis     ],
        [isNumber,      NumberVis     ],
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