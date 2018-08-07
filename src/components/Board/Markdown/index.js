import React, { PureComponent } from "react"
import { isString } from "lodash-es"
import { Base64 } from "js-base64"

import monaco, { renderMarkdown } from "../../MonacoEditor"

import "./style.sass"

const markdownToHTML = (value) => {
    const result = renderMarkdown({
        value
    }, {
        inline: false,
        codeBlockRenderer: async function (languageAlias, value) {
            const codeblock = await monaco.editor.colorize(value, languageAlias)

            return `
                <div class="codeContainer">
                    <button class="runButton" onclick="loadCode('${Base64.encode(value)}')">Run</button>
                    ${codeblock}
                </div>
            `
        }
    })
    return result
}

export default class Markdown extends PureComponent {
    _containerElement = null
    _colorizedElement = null

    colorize = async (value) => {
        if (!this._containerElement) {
            return
        }

        if (!isString(value)) {
            return
        }
        const stringValue = "" + value

        const colorizedElement = markdownToHTML(stringValue)

        if (this._colorizedElement) {
            this._containerElement.replaceChild(colorizedElement, this._colorizedElement)
        } else {
            this._containerElement.appendChild(colorizedElement)
        }

        this._colorizedElement = colorizedElement

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
        return <div ref={e => this._containerElement = e} className="property markdown" />
    }

}