import React, { PureComponent } from "react"

import { of } from "rxjs"

import "normalize.css"
import "./style.sass"

import Editor from "./Editor"
import Evaluator from "./Evaluator"
import Board from "./Board"
import Panel from "./Panel"

import defaultCode from "../gallery/0_helloWorld.l1"

export default class Studio extends PureComponent {
    state = {
        code: defaultCode,
        ast: null,
        computedValues: of({})
    }

    issues = null

    // defaultExample = "21_closures"
    // defaultExample = "1_intro"

    // async componentDidMount() {
    //     const code = await this.loadFromGallery(this.defaultExample)
    //     this.setState({ code })
    // }
    // loadFromGallery = async id => {
    //     const module = await import(`../gallery/${id}.l1`)
    //     return module.default
    // }
    codeChanged = async (code, editor, issues) => {
        this.setState(await Evaluator.evaluate(code, {}, issues))
    }
    componentDidMount() {
        this.codeChanged(this.state.code)
    }
    render() {
        return (
            <div className="studio">
                <Panel id="board" scrollable={true}>
                    <Board data={this.state.computedValues} />
                </Panel>
                <Panel id="editor">
                    <Editor
                        content={this.state.code}
                        language="L1"
                        theme="L1"
                        onChange={this.codeChanged}
                        issues={this.issues}
                        onExecute={this.codeChanged.bind(this, this.state.code)}
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