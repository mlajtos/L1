import React, { PureComponent } from "react"

// TODO: simplify this
import { monaco, language, provider, theme } from "../../MonacoEditor"
monaco.languages.register(language)
monaco.languages.setMonarchTokensProvider("moniel", provider)
monaco.editor.defineTheme("moniel", theme)

export default class ColorizedCode extends PureComponent {
    state = {
        value: this.props.children,
        colorizedValue: null,
        mounted: false
    }
    colorize = async (value) => {
        const stringValue = "" + value
        const colorizedValue = await monaco.editor.colorize(stringValue, "moniel")
        if (this._mounted) {
            this.setState({ colorizedValue })
        }
    }
    componentDidUpdate() {
        this.colorize(this.state.value)
    }
    componentDidMount() {
        this._mounted = true
        this.colorize(this.state.value)
    }
    componentWillUnmount() {
        this._mounted = false
    }
    render() {
        if (!this.state.colorizedValue) {
            return <div>{this.state.value}</div>
        } else {
            return <div dangerouslySetInnerHTML={{__html: this.state.colorizedValue}} />
        }
    }

}