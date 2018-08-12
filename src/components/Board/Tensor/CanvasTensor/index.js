import React, { PureComponent } from "react"
import { isFunction } from "lodash-es"

import { normalizeTensor } from "../index"

import "./style.sass"

export default class CanvasTensor extends PureComponent {
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
            const [w = 1, h = 1] = tensorShape
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
            const [h = 1, w = 1] = tensorShape
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