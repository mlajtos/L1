import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs-core"

import { repeat } from "lodash-es"
import numeral from "numeral"

import ScalarVis from "../Scalar"
import PropertyWrapper from "../PropertyWrapper"
import SvgTensor from "./SvgTensor"
import CanvasTensor from "./CanvasTensor"

import Stats from "./Stats"

import "./style.sass"

export default class Tensor extends PureComponent {
    state = {
        isVariable: false,
        data: null,
        revisionId: 0
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data !== prevState.data) {
            const isVariable = (nextProps.data instanceof tf.Variable)
            const symbol = (isVariable ? "$" : "") + "[]"
            return {
                data: nextProps.data,
                isVariable,
                symbol,
                revisionId: prevState.revisionId
            }
        }

        return null
    }
    componentDidMount() {
        if (this.state.isVariable) {
            this.state.data.subscribe(this.update)
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            if (prevProps.data instanceof tf.Variable) {
                prevProps.data.unsubscribe(this.update)
            }
            if (this.state.isVariable) {
                this.state.data.subscribe(this.update)
            }
        }
    }
    componentWillUnmount() {
        if (this.state.isVariable) {
            this.state.data.unsubscribe(this.update)
        }
    }
    update = () => {
        this.setState({
            revisionId: this.state.revisionId + 1
        })
    }
    render() {
        if (!this.state.data) {
            return null
        }
        const isScalar = (this.state.data.rank === 0)
        const Component = isScalar ? ScalarVis : GenericTensor

        return (
            <PropertyWrapper {...this.props} type={"tensor " + (isScalar ? "scalar" : "")} symbol={this.state.symbol}>
                <Component data={this.state.data} revisionId={this.state.revisionId} />
            </PropertyWrapper>
        )
    }
}

class GenericTensor extends PureComponent {
    render() {
        const data = this.props.data

        return (
            <div className="tensor-content">
                <div className="visualization">
                    {
                        (true || this.props.data.size > 25)
                            ? <CanvasTensor key="canvas" data={data} revisionId={this.props.revisionId} />
                            : <SvgTensor data={data} />
                    }
                </div>
                <Stats key="stats" data={data} revisionId={this.props.revisionId} />
            </div>
        )
    }
}

export const formatNumber = (number, decimalDigits = 2) => {
    try {
        return numeral(number).format(`0,0.[${repeat("0", decimalDigits)}]`).replace(/,/g, "_")
    } catch (e) {
        console.log(number, e)
        return "???"
    }
}

const scaleFeatures = (t, a, b) => {
    const min = t.min()
    const max = t.max()
    // a + ((r - min) / (max - min)) * (b - a))
    return a.add(t.sub(min).div(max.sub(min)).mul(b.sub(a)))
}

export const normalizeTensor = (tensor) => {
    // r = (x - mu)
    const r = tensor.sub(tensor.mean())
    const a = tf.scalar(-1)
    const b = tf.scalar(1)
    const normalized = scaleFeatures(r, a, b)
    return scaleFeatures(normalized, tf.scalar(0), tf.scalar(255))
}