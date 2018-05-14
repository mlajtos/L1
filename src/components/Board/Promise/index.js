import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"

import ObjectProperty from "../ObjectProperty"
import PropertyWrapper from "../PropertyWrapper"

import "./style.sass"

const isPromise = (value) => (value.toString() === "[object Promise]")

export default class Promise extends PureComponent {
    state = {
        data: null,
        resolved: false
    }
    _mounted = false
    
    resolve() {
        this.props.data.then(data => {
            if (this._mounted) {
                this.setState({
                    data,
                    resolved: true
                })
            }
        })
    }

    componentDidMount() {
        this._mounted = true
        this.resolve()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                resolved: false
            })
            this.resolve()
        }
    }

    render() {
        return (
            <div className={"promise " + (this.state.resolved ? "resolved" : "unresolved")}>
                <ObjectProperty {...this.props} data={this.state.data} />
            </div>
        )
    }
}