import React, { PureComponent } from "react"

import ObjectProperty from "../ObjectProperty"

import "./style.sass"

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