import React, { PureComponent } from "react"

import monaco from "../../MonacoEditor"

import "./style.sass"

export default class Code extends PureComponent {
    state = {
        colorizedValue: null,
        mounted: false
    }
    colorize = async (value) => {
        const stringValue = "" + value
        const colorizedValue = await monaco.editor.colorize(stringValue, this.props.language || "L1")
        if (this._mounted) {
            this.setState({ colorizedValue })
        }
    }
    componentDidUpdate() {
        this.colorize(this.props.children)
    }
    componentDidMount() {
        this._mounted = true
        this.colorize(this.props.children)
    }
    componentWillUnmount() {
        this._mounted = false
    }
    render() {
        if (!this.state.colorizedValue) {
            return <div className="codeHighlight">{this.props.children}</div>
        } else {
            return <div className="codeHighlight" dangerouslySetInnerHTML={{__html: this.state.colorizedValue}} />
        }
    }

}