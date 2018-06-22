import React, { PureComponent } from "react"

import "normalize.css"
import "./style.sass"

import Editor from "./Editor"
import Evaluator from "./Evaluator"
import Board from "./Board"
import Panel from "./Panel"

import Code from "./Board/Code"
import readme from "../../README.md"

export default class Studio extends PureComponent {
    state = {
        code: "",
        ast: null,
        computedValues: null
    }

    issues = null

    async componentDidMount() {
        const code = await this.loadFromGallery("21_closures")
        this.setState({ code })
    }
    codeChanged = async (code, editor, issues) => {
        this.setState(await Evaluator.evaluate(code, {}, issues))
    }
    loadFromGallery = async id => {
        const module = await import(`../gallery/${id}.l1`)
        return module.default
    }
    render() {
        return (
            <div className="studio">
                <Panel scrollable={true}>
                    <Board data={this.state.computedValues} />
                </Panel>
                <Panel>
                    <Editor
                        content={this.state.code}
                        language="L1"
                        theme="L1"
                        onChange={this.codeChanged}
                        issues={this.issues}
                        onExecute={this.codeChanged.bind(this, this.state.code)}
                    />
                </Panel>
                {/* <Panel>
                    <Code language="markdown">
                        {readme}
                    </Code>
                </Panel> */}
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