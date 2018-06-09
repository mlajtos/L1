import React, { PureComponent } from "react"

import ObjectProperty from "../ObjectProperty"

import "./style.sass"

export default class Observable extends PureComponent {
    state = {
        data: null,
        value: null
    }
    _mounted = false
    onNext = (value) => this.setState({ value })

    componentDidMount() {
        this._mounted = true
        this.subscription = this.props.data.subscribe(this.onNext)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data !== prevState.data) {
            return {
                data: nextProps.data
            }
        }

        return null
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.data !== this.state.data) {
            this.subscription.unsubscribe()
            this.subscription = this.state.data.subscribe(this.onNext)
        }
    }

    componentWillUnmount() {
        this._mounted = false
        this.subscription.unsubscribe()
    }

    render() {
        return (
            <div className={"observable"}>
                <ObjectProperty {...this.props} data={this.state.value} />
            </div>
        )
    }
}