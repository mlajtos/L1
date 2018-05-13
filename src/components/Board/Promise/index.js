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

    componentDidMount() {
        if (isPromise(this.props.data)) {
            this.props.data.then(data => {
                this.setState({
                    data,
                    resolved: true
                })
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            if (isPromise(this.props.data)) {
                this.setState({
                    resolved: false
                })
                this.props.data.then(data => {
                    this.setState({
                        data,
                        resolved: true
                    })
                })
            }
        }
    }

    render() {
        let data

        if (!(isPromise(this.props.data))) {
            data = this.props.data
        } else {
            data = this.state.data
        }

        return (
            <div className={"promise " + (this.state.resolved ? "resolved" : "unresolved")}>
                <ObjectProperty {...this.props} data={data} />
            </div>
        )
    }
}