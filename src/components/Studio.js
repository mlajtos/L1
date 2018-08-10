import React, { PureComponent } from "react"
import { of } from "rxjs"
import { Base64 } from "js-base64"

import "normalize.css"
import "./style.sass"

import Editor from "./Editor"
import Evaluator from "./Evaluator"
import Board from "./Board"
import Panel from "./Panel"

import helloWorldCode from "../gallery/0_helloWorld.l1"

const encodeSource = (code) => Base64.encode(code)

const decodeHash = (hash) => {
    try {
        return Base64.decode(hash)
    } catch (e) {
        return undefined
    }
}

const codeFromHash = decodeHash(document.location.hash.substring(1))
if (codeFromHash) {
    history.replaceState({ code: codeFromHash, saved: true, timestamp: Date.now() }, "", "#" + encodeSource(codeFromHash))
}
const defaultCode = codeFromHash || helloWorldCode

export default class Studio extends PureComponent {
    _editor = null
    state = {
        code: defaultCode,
        ast: null,
        computedValues: of({}),
        outOfSync: false
    }
    _onPopState = (e) => {
        if (e.state && e.state.code) {
            this._editor.setContent(e.state.code)
        }
    }
    componentDidMount() {
        window.addEventListener("popstate", this._onPopState)
        window.loadCode = (hash) => {
            const code = decodeHash(hash)
            this._editor.setContent(code)
            history.pushState({ code, saved: true, timestamp: Date.now() }, "", "#" + hash)
        }
    }
    componentWillUnmount() {
        window.removeEventListener("popstate", this._onPopState)
    }
    handleHistory(code) {
        if (code !== this.state.code) {
            if (history.state) {
                if (history.state.saved || false) {
                    history.pushState({ code, saved: false, timestamp: Date.now() }, "", "#")
                } else {
                    history.replaceState({ code, saved: false, timestamp: Date.now() }, "", "#")
                }
            } else {
                history.pushState({ code, saved: false, timestamp: Date.now() }, "", "#")
            }
        }
    }
    codeChanged = async (code, editor, issues, forced) => {
        if (!forced) {
            this.handleHistory(code)
        }
        const result = await Evaluator.evaluate(code, {}, issues)

        if (result.ast) {
            this.setState({
                ...result,
                outOfSync: false
            })
        } else {
            this.setState({ outOfSync: true })
        }
    }
    saveCode = () => {
        history.replaceState({ code: this.state.code, saved: true, timestamp: Date.now() }, "", "#" + encodeSource(this.state.code))
    }
    render() {
        return (
            <div className="studio">
                <Panel id="board" scrollable={true} disabled={this.state.outOfSync}>
                    <Board data={this.state.computedValues} />
                </Panel>
                <Panel id="editor">
                    <Editor
                        ref={e => this._editor = e}
                        content={this.state.code}
                        language="L1"
                        theme="L1"
                        onChange={this.codeChanged}
                        onExecute={this.codeChanged.bind(this, this.state.code)}
                        onSave={this.saveCode}
                    />
                </Panel>
                {/* <Panel name="AST" hidden={true}>
                    <Editor
                        content={JSON.stringify(this.state.ast, null, 2)}
                        language="json"
                        readOnly={true}
                        tabSize={2}
                    />
                </Panel> */}
            </div>
        )
    }
}