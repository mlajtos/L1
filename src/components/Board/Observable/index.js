import React, { PureComponent } from "react"

import ObjectProperty from "../ObjectProperty"

import "./style.sass"

export default class Observable extends PureComponent {
    state = {
        data: null,
        value: undefined,
        error: undefined,
        completed: false
    }
    _mounted = false
    onNext = (value) => this.setState({ value, error: undefined })
    onError = (error) => this.setState({ value: undefined, error })
    onCompleted = () => this.setState({ completed: true })

    componentDidMount() {
        this._mounted = true
        this.subscription = this.props.data.subscribe(this.onNext, this.onError, this.onCompleted)
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
            this.subscription = this.state.data.subscribe(this.onNext, this.onError, this.onCompleted)
        }
    }

    componentWillUnmount() {
        this._mounted = false
        this.subscription.unsubscribe()
    }

    render = () => (
        <div className={"observable " + (this.state.error ? "error" : "")}>
            <ObjectProperty {...this.props} data={this.state.error || this.state.value} />
        </div>
    )
}