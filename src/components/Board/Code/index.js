import React, { PureComponent } from "react"

// TODO: simplify this
import { monaco, language, provider, theme } from "../../MonacoEditor"
monaco.languages.register(language)
monaco.languages.setMonarchTokensProvider("moniel", provider)
monaco.editor.defineTheme("moniel", theme)

export default class ColorizedCode extends PureComponent {
    state = {
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
            return <div>{this.props.children}</div>
        } else {
            return <div dangerouslySetInnerHTML={{__html: this.state.colorizedValue}} />
        }
    }

}