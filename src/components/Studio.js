import React, { PureComponent } from "react"

import "normalize.css"
import "./style.sass"

import Editor from "./Editor"
import Evaluator from "./Evaluator"
import Board from "./Board"
import Panel from "./Panel"

export default class Studio extends PureComponent {
    state = {
        code: "",
        ast: null,
        issues: [],
        computedValues: null
    }

    async componentDidMount() {
        const code = await this.loadFromGallery("22_polynomial_regression")
        this.setState({ code })
    }
    codeChanged = async (code, editor) => {
        this.setState(await Evaluator.evaluate(code))
    }
    loadFromGallery = async id => {
        const module = await import(`../gallery/${id}.mon`)
        return module.default
    }
    render() {
        return (
            <div className="studio">
                <Panel name="Visualization" hidden={false}>
                    <Board data={this.state.computedValues} />
                </Panel>
                <Panel name="Code">
                    <Editor
                        content={this.state.code}
                        language="moniel"
                        theme="moniel"
                        onChange={this.codeChanged}
                        issues={this.state.issues}
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