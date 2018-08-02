import React, { PureComponent } from "react"
import { of } from "rxjs"

import "normalize.css"
import "./style.sass"

import Editor from "./Editor"
import Evaluator from "./Evaluator"
import Board from "./Board"
import Panel from "./Panel"

import helloWorldCode from "../gallery/0_helloWorld.l1"

const decodeHash = (hash) => {
    try {
        return atob(hash.substring(1))
    } catch (e) {
        return undefined
    }
}

const codeFromHash = decodeHash(document.location.hash)
const defaultCode = codeFromHash || helloWorldCode

export default class Studio extends PureComponent {
    _editor = null
    state = {
        code: defaultCode,
        ast: null,
        computedValues: of({}),
        dirty: false
    }
    _onPopState = (e) => {
        if (e.state && e.state.code) {
            this._editor.setContent(e.state.code)
        }
    }
    componentDidMount() {
        window.addEventListener("popstate", this._onPopState)
        window.loadCode = (hash) => {
            const code = atob(hash)
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
        this.setState(await Evaluator.evaluate(code, {}, issues))
    }
    saveCode = () => {
        history.replaceState({ code: this.state.code, saved: true, timestamp: Date.now() }, "", "#" + btoa(this.state.code))
    }
    render() {
        return (
            <div className="studio">
                <Panel id="board" scrollable={true}>
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