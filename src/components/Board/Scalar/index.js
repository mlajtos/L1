import React, { PureComponent } from "react"

import Code from "../Code"
import { formatNumber } from "../Tensor"

import "./style.sass"

export default class ScalarVis extends PureComponent {
    state = {
        numericValue: 0
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            numericValue: nextProps.data.dataSync()[0]
        }
    }
    onKeyDown = (e) => {
        let delta = 1

        if (e.key === "ArrowUp") {

        } else if (e.key === "ArrowDown") {
            delta *= -1
        } else {
            return
        }

        e.preventDefault()

        if (e.metaKey) {
            delta *= 100
        }
        if (e.shiftKey) {
            delta *= 10
        }
        if (e.altKey) {
            delta *= 0.1
        }

        this.setState({
            numericValue: this.state.numericValue + delta
        })
    }
    render() {
        return (
            <div className="scalar" tabIndex="0" onKeyDown={this.onKeyDown}>
                <Code>
                    {formatNumber(this.state.numericValue)}
                </Code>
            </div>
        )
    }
}