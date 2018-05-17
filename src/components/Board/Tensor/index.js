import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs-core"

import { isFunction } from "lodash-es"
import numeral from "numeral"

import ScalarVis from "../Scalar"
import PropertyWrapper from "../PropertyWrapper"

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
            return  {
                data: nextProps.data,
                isVariable,
                symbol,
                revisionId: 0
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
            <PropertyWrapper {...this.props} type="tensor" symbol={this.state.symbol}>
                <Component data={this.state.data} revisionId={this.state.revisionId} />
            </PropertyWrapper>
        )
    }
}

class GenericTensor extends PureComponent {
    render() {
        const data = this.props.data

        return (
            <div className="tensor-content">
                <TensorCanvas key="canvas" data={data} revisionId={this.props.revisionId} />
                <Stats key="stats" data={data} revisionId={this.props.revisionId} />
            </div>
        )
    }
}

class TensorCanvas extends PureComponent {
    canvas = null
    _mount = (el) => {
        this.canvas = el
        if (this.canvas) {
            this._draw(this.props.data)
        }
    }

    _draw = async (tensor) => {
        const canvas = this.canvas
        const context = canvas.getContext("2d")

        const rank = tensor.rank
        const fn = this[`_createImageData${rank}D`]
        if (!isFunction(fn)) {
            throw Error(`Drawing function is not available.`)
        }

        const imageData = await fn(tensor, context)
        
        // console.log(imageData)

        canvas.width = imageData.width
        canvas.height = imageData.height

        window.requestAnimationFrame(() => context.putImageData(imageData, 0, 0))
    }
    _createImageData0D = async (tensor, context) => {
        const imageData = context.createImageData(1, 1)
        return imageData
    }
    _createImageData1D = async (tensor, context) => {
        let [height, width] = ((tensorShape) => {
            const [w=1, h=1] = tensorShape
            return [h, w]
        })(tensor.shape)

        const imageData = context.createImageData(width, height)

        const normalized = await normalizeTensor(tensor)
        const data = await normalized.data()

        for (let i = 0; i < tensor.size; i++) {
            const j = i * 4
            const v = Math.round(data[i])
            const valid = !isNaN(v)
            imageData.data[j + 0] = valid ? v : 255
            imageData.data[j + 1] = valid ? v : 0
            imageData.data[j + 2] = valid ? v : 0
            imageData.data[j + 3] = 255
        }

        return imageData
    }
    _createImageData2D = async (tensor, context) => {
        let [height, width] = ((tensorShape) => {
            const [h=1, w=1] = tensorShape
            return [h, w]
        })(tensor.shape)

        const imageData = context.createImageData(width, height)

        const normalized = await normalizeTensor(tensor)
        const data = await normalized.data()

        for (let i = 0; i < tensor.size; i++) {
            const j = i * 4
            const v = Math.round(data[i])
            const valid = !isNaN(v)
            imageData.data[j + 0] = valid ? v : 255
            imageData.data[j + 1] = valid ? v : 0
            imageData.data[j + 2] = valid ? v : 0
            imageData.data[j + 3] = 255
        }

        return imageData
    }
    _createImageData3D = async (tensor, context) => {
        return this._createImageData2D(tensor, context)
    }
    componentDidUpdate(prevProps, prevState) {
        this._draw(this.props.data)
    }
    render() {
        return (
            <div className="canvas">
                <canvas className="tensor-canvas" ref={this._mount} />
            </div>
        )
    }
}

export const formatNumber = (number) => {
    try{
        return numeral(number).format("0,0.[00]").replace(/,/g, "_")
    } catch (e) {
        console.log(number, e)
        return "???"
    }
}

const scaleFeatures = async (t, a, b) => {
    const min = t.min()
    const max = t.max()
    // a + ((r - min) / (max - min)) * (b - a))
    return a.add(t.sub(min).div(max.sub(min)).mul(b.sub(a)))
}

const normalizeTensor = async (tensor) => {
    // r = (x - mu)
    const r = tensor.sub(tensor.mean())
    const a = tf.scalar(-1)
    const b = tf.scalar(1)
    const normalized = await scaleFeatures(r, a, b)
    return await scaleFeatures(normalized, tf.scalar(0), tf.scalar(255))
}