import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"

import "normalize.css"
import "./style.sass"

import code from "../examples/7_edge_detection.mon";

import Editor from "./Editor"
import Evaluator from "./Evaluator"
import Board from "./Board"
import Panel from "./Panel"

// import Worker from "./test.worker.js"
// const worker = new Worker()
// worker.postMessage({ a: 1 })
// worker.addEventListener("message", (event) => {
//     console.log(event)
// })

//import { loadTestLabels, loadTestImages } from "./Dataset"

export default class Studio extends PureComponent {
    state = {
        code,
        ast: null,
        issues: [],
        computedValues: []
    }
    codeChanged = async (code, editor) => {
        this.setState(await Evaluator.evaluate(code))
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
                <Panel name="AST" hidden={true}>
                    <Editor
                        content={JSON.stringify(this.state.ast, null, 2)}
                        language="json"
                        readOnly={true}
                        tabSize={2}
                    />
                </Panel>
            </div>
        )
    }
}