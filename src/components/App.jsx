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

export default class App extends PureComponent {
    state = {
        code,
        ast: null,
        issues: [],
        computedValues: []
    }
    codeChanged = (code) => {
        this.setState(Evaluator.evaluateSync(code))
    }
    render() {

        // const fakeIssue = {
        //     startLineNumber: 5,
        //     startColumn: 5,
        //     endLineNumber: 5,
        //     endColumn: 17,
        //     message: "Aha, tu máš bug...",
        //     severity: "error"
        // }

        const issues = [...this.state.issues, /*fakeIssue*/]

        return (
            <div className="studio">
                <Panel name="Visualization" hidden={false}>
                    <Board data={this.state.computedValues} />
                </Panel>
                <Panel name="Code">
                    <Editor
                        content={code}
                        language="moniel"
                        theme="moniel"
                        onChange={this.codeChanged}
                        issues={issues}
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
                <Panel name="Result" hidden={true}>
                    <Editor
                        content={JSON.stringify(this.state.interpretingResult, null, 2)}
                        language="json"
                        readOnly={true}
                        tabSize={2}
                    />
                </Panel>
            </div>
        )
    }
}