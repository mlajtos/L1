import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"

import "normalize.css"
import "./style.sass"

import code from "../examples/7_edge_detection.mon";

import Editor from "./Editor"
import Parser from "./Parser"
import Interpreter from "./Interpreter"
import TensorVisualization from "./TensorVisualization"

import Worker from "./test.worker.js"
const worker = new Worker()
worker.postMessage({ a: 1 })
worker.addEventListener("message", (event) => {
    console.log(event)
})

//import { loadTestLabels, loadTestImages } from "./Dataset"

export default class App extends PureComponent {
    state = {
        code,
        ast: null,
        issues: [],
        computedValues: []
    }
    codeChanged = async (code) => {
        const parsingResult = await Parser.parse(code)
        const ast = parsingResult.result || null
        const parsingError =  parsingResult.error || null
        const interpretingResult = ast ? await Interpreter.interpret(ast) : null
        const computedValues = interpretingResult ? interpretingResult.success.result || [] : []

        const parsingIssues = parsingResult.issues
        const interpretingIssues = interpretingResult ? interpretingResult.success.issues : []

        this.setState({
            code,
            ast,
            error: parsingError,
            computedValues,
            issues: [...parsingIssues, ...interpretingIssues]
        })
    }
    render() {
        const style = {
            display: "flex",
            height: "100vh",
            width: "100wv",
            overflow: "hidden"
        }

        const error = this.state.error
            ? (
                <div style={{ backgroundColor: "red", whiteSpace: "pre", fontFamily: "monospace" }}>
                    {this.state.error.message}
                </div>
            ) : null

        const tensors = Object.entries(this.state.computedValues)
            .filter(([key, value]) => (value instanceof tf.Tensor))
            .map(([key, value]) => <TensorVisualization key={key} name={key} data={value} />)

        const fakeIssue = {
            startLineNumber: 5,
            startColumn: 5,
            endLineNumber: 5,
            endColumn: 17,
            message: "Aha, tu máš bug...",
            severity: "error"
        }

        const issues = [...this.state.issues, /*fakeIssue*/]

        return (
            <div style={style}>
                <Panel name="Visualization" hidden={false}>
                    <div className="tensors">
                        { tensors }
                    </div>
                </Panel>
                { error }
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

class Panel extends PureComponent {
    state = {
        hidden: ("hidden" in this.props) ? this.props.hidden : false
    }
    render() {

        return (
            <div className={`panel ` + (this.state.hidden ? "hidden" : "shown")}>
                <div className="panel-header">
                    <a onClick={ e => { this.setState({ hidden: !this.state.hidden }) } }>{this.props.name}</a>
                </div>
                <div className="panel-content">
                    {
                        this.state.hidden
                            ? null
                            : this.props.children
                    }
                </div>
            </div>
        )
    }
}