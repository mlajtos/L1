import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"

import { isFunction } from "lodash"

import Colorize from "../../ColorizedCode"

import "./style.sass"

export default class Tensor extends PureComponent {
    render() {
        const data = this.props.data
        const isTensor = (data instanceof tf.Tensor)

        if (!isTensor) {
            return null
        }

        return [
            <TensorCanvas key="canvas" data={data} />,
            <TensorStatistics key="stats" data={data} />
        ]
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
        
        console.log(imageData)

        canvas.width = imageData.width
        canvas.height = imageData.height

        context.putImageData(imageData, 0, 0)
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

const Field = ({ name, children }) => (
    <div className="field">
        <div className="label">
            <Colorize>{name}</Colorize>
        </div>
        <div className="value">
            <Colorize>{children}</Colorize>
        </div>
    </div>
)

const formatNumber = (number) => {
    try{
        return number.toFixed(2)
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

class TensorStatistics extends PureComponent {
    state = {
        data: null,
        min: 0,
        max: 0,
        mean: 0,
        computing: false
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log("getDerivedStateFromProps", nextProps.data === prevState.data ? "same" : "diff")
        if (nextProps.data === prevState.data) {
            return null
        }

        const newState = {
            data: nextProps.data,
            computing: true
        }

        return newState
    }
    componentDidMount() {
        this.updateStats()
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log("componentDidUpdate")
        if (prevState.data !== this.state.data) {
            this.updateStats()
        }
    }
    async updateStats() {
        this.setState({
            min: await this.state.data.min().data(),
            max: await this.state.data.max().data(),
            mean: await this.state.data.mean().data(),
            computing: false
        })
    }
    render() {
        return (
            <div className="info">
                <Field name="Shape">
                    {"[" + this.state.data.shape.join(" ") + "]"}
                </Field>
                <Field name="Size">
                    {this.state.data.size}
                </Field>
                <Field name="Rank">
                    {this.state.data.rank}
                </Field>
                <Field name="Mean">
                    {formatNumber(+this.state.mean)}
                </Field>
                <Field name="Range">
                    {formatNumber(this.state.max - this.state.min)}
                </Field>
                <Field name="Min">
                    {formatNumber(+this.state.min)}
                </Field>
                <Field name="Max">
                    {formatNumber(+this.state.max)}
                </Field>
                { this.state.computing ? "Computing..." : null}
            </div>
        )
    }
}