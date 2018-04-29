import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"

// TODO: simplify this
import { monaco, language, provider, theme } from "./MonacoEditor"
monaco.languages.register(language)
monaco.languages.setMonarchTokensProvider("moniel", provider)
monaco.editor.defineTheme("moniel", theme)

export default class DataVisualization extends PureComponent {
    render() {
        const data = this.props.data
        const isTensor = (data instanceof tf.Tensor)

        return (
            <div className="entity">
                <div className="name">
                    <ColorizedValue value={this.props.name} />
                </div>
                <div className="content">
                    {
                        isTensor
                            ? [
                                <TensorCanvas key="canvas" data={data} />,
                                <TensorStatistics key="stats" data={data} />
                            ]
                            : <pre>{JSON.stringify(data)}</pre>
                    }
                </div>
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
        const t = tensor
        const canvas = this.canvas
        const context = canvas.getContext("2d")
        let [height, width] = ((tensorShape) => {
            const [h=1, w=1] = tensorShape
            return [h, w]
        })(tensor.shape)
        canvas.width = width
        canvas.height = height
        const imageData = context.createImageData(width, height)

        const normalized = await normalizeTensor(t)
        const data = await normalized.data()

        for (let i = 0; i < t.size; i++) {
            const j = i * 4
            const v = Math.round(data[i])
            const valid = !isNaN(v)
            imageData.data[j + 0] = valid ? v : 255
            imageData.data[j + 1] = valid ? v : 0
            imageData.data[j + 2] = valid ? v : 0
            imageData.data[j + 3] = 255
        }

        context.putImageData(imageData, 0, 0)
    }
    componentDidUpdate(prevProps, prevState) {
        this._draw(this.props.data)
    }
    render() {
        return <canvas ref={this._mount} />
    }
}

class ColorizedValue extends PureComponent {
    el = null
    mount = (el) => {
        this.el = el
    }
    componentDidUpdate() {
        if (this.el) {
            monaco.editor.colorizeElement(this.el, {
                theme: "moniel",
                language: "moniel",
                fontFamily: "Fira Code"
            })
        }
    }
    componentDidMount() {
        if (this.el) {
            monaco.editor.colorizeElement(this.el, {
                theme: "moniel",
                language: "moniel"
            })
        }
    }
    render() {
        return (
            <div data-lang="moniel" ref={this.mount}>
                {this.props.value}
            </div>
        )
    }

}

const Field = ({ name, children }) => (
    <div className="field">
        <div className="label">
            <ColorizedValue value={name} />
        </div>
        <div className="value">
            <ColorizedValue value={children} />
        </div>
    </div>
)

const formatNumber = (number) => {
    if (isNaN(number)) {
        return <span style={{color: "red"}}>NaN</span>
    }
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