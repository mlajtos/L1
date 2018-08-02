import React, { PureComponent } from "react"

import Code from "../../Code"

import { formatNumber } from ".."

export default class Stats extends PureComponent {
    state = {
        data: null,
        min: 0,
        max: 0,
        mean: 0,
        computing: false,
        revisionId: 0
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data === prevState.data && nextProps.revisionId === prevState.revisionId) {
            return null
        }

        const newState = {
            data: nextProps.data,
            revisionId: nextProps.revisionId,
            computing: true
        }

        return newState
    }
    componentDidMount() {
        this.updateStats()
        this._mounted = true
    }
    componentWillUnmount() {
        this._mounted = false
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.data !== this.state.data || prevState.revisionId !== this.state.revisionId) {
            this.updateStats()
        }
    }
    async updateStats() {
        const updatedState = {
            min: (await this.props.data.min().data())[0],
            max: (await this.props.data.max().data())[0],
            mean: (await this.props.data.mean().data())[0],
            computing: false
        }
        
        if (this._mounted) {
            this.setState(updatedState)
        }
    }
    render() {
        return (
            <div className="info">
                <Field name="Shape">
                    {"[" + this.state.data.shape.map(formatNumber).join(" ") + "]"}
                </Field>
                <Field name="Size">
                    {formatNumber(this.state.data.size)}
                </Field>
                <Field name="Rank">
                    {formatNumber(this.state.data.rank)}
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
                {/* { this.state.computing ? "Computing..." : null} */}
            </div>
        )
    }
}

const Field = ({ name, children }) => (
    <div className="field">
        <div className="label">
            <Code>{name}</Code>
        </div>
        <div className="value">
            <Code>{children}</Code>
        </div>
    </div>
)