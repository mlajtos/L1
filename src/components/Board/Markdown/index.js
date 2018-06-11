import React, { PureComponent } from "react"

import monaco, { renderMarkdown } from "../../MonacoEditor"

import { MarkdownRenderer } from 'monaco-editor/esm/vs/editor/contrib/markdown/markdownRenderer';
import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices';

// console.log(StaticServices)
// const renderer = new MarkdownRenderer(monaco.editor.create(document.createElement("div")), StaticServices.modeService.get())
// const el = renderer.render({
//     value: "# L1\n```L1\na: 23```"
// }).element

// console.log(el, el.innerHTML)

import "./style.sass"

const markdownToHTML = (value) => {
    const result = renderMarkdown({
        value
    }).innerHTML
    return result
}

const markdownToHTML_2 = (value) => {
    const result = renderer.render({
        value
    }).element.innerHTML
    return result
}

export default class Markdown extends PureComponent {
    state = {
        colorizedValue: null,
        mounted: false
    }
    colorize = async (value) => {
        const stringValue = "" + value
        const colorizedValue = markdownToHTML(stringValue)
        // const colorizedValue = 
        // console.log(colorizedValue)
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
            return <div className="property markdown">{this.props.children}</div>
        } else {
            return <div className="property markdown" dangerouslySetInnerHTML={{__html: this.state.colorizedValue}} />
        }
    }

}