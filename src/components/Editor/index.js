import React, { PureComponent } from "react"
import ReactDOM from "react-dom"
import { isFunction } from "lodash-es"
import FontFaceObserver from "fontfaceobserver"

import "./style.sass"

import monaco from "../MonacoEditor"
import { Subject } from "rxjs"

export default class Editor extends PureComponent {
    container = null
    editor = null
    decorations = []
    viewZones = []
    issues = new Subject
    issuesSubscription = null
    _mount = async (el) => {
        this.container = el
        if (this.container) {
            const font = new FontFaceObserver("Fira Code")
            font.load().then(this.instantiateEditor, (e) => {
                console.log("Could not load the font")
            })
        }
    }
    instantiateEditor = () => {
        const config = {
            value: this.props.content,
            language: this.props.language,
            theme: "L1",
            fontFamily: "Fira Code",
            fontSize: 16,
            fontLigatures: true,
            tabSize: ("tabSize" in this.props) ? this.props.tabSize : 4,
            readOnly: ("readOnly" in this.props) ? this.props.readOnly : false,
            glyphMargin: true,
            // lineNumbers: false,
            lineNumbersMinChars: 2,
            lineDecorationsWidth: 0,
            wordWrap: "bounded",
            wrappingIndent: "indent",
            autoIndent: true,
            formatOnType: true, 
            minimap: {
                enabled: false
            },
            scrollBeyondLastLine: true, // good when there is multiline error message on last line
            scrollbar: {
                useShadows: true,
                verticalScrollbarSize: 5,
                vertical: "visible",
                horizontalScrollbarSize: 5,
                horizontal: "hidden"
            }
        }
        this.editor = monaco.editor.create(this.container, config)
        window.addEventListener("resize", (e) => {
            this.editor.layout()
        })
        this.editor.onDidChangeModelContent((e) => {
            const fn = this.props.onChange || undefined
            if (isFunction(fn)) {
                const code = this.editor.getValue()
                this.issues.next(null)
                fn.apply(null, [code, this.editor, this.issues])
            }
        })
        this.editor.addAction({
            id: "executeCode",
            label: "Execute Code",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
            ],
            run: (editor) => {
                const fn = this.props.onExecute || undefined
                if (isFunction(fn)) {
                    fn.apply(null, [editor, this.issues])
                }
                return null;
            }
        });
    }
    removeDecoration() {
        this.editor.changeViewZones(changeAccessor => {
            changeAccessor.removeZone(this.viewZone)
        })
        this.decoration = this.editor.deltaDecorations([this.decoration], [])
        monaco.editor.setModelMarkers(this.editor.getModel(), "test", [])
    }
    setDecorationForIssue(issue) {

        if (issue === null) {
            this.removeDecoration()
            return
        }

        const marker = {
            startLineNumber: issue.startLineNumber,
            startColumn: issue.startColumn,
            endLineNumber: issue.endLineNumber,
            endColumn: issue.endColumn,
            message: issue.message,
            severity: severityTable[issue.severity]
        }

        const lineDecoration = {
            range: new monaco.Range(issue.startLineNumber, issue.startColumn, issue.startLineNumber,issue. startColumn),
            options: {
                isWholeLine: true,
                className: `inlineDecoration ${issue.severity}`,
                glyphMarginClassName: `glyphDecoration ${issue.severity}`,
                glyphMarginHoverMessage: issue.message
            }
        }

        this.editor.changeViewZones(changeAccessor => {
            changeAccessor.removeZone(this.viewZone)

            this.viewZone = (() => {
                const domNode = document.createElement("div")
                this.renderIssue(issue, domNode)

                return changeAccessor.addZone({
                    afterLineNumber: issue.startLineNumber,
                    // afterColumn: 0,
                    heightInLines: 0,
                    domNode
                })
            })()
        })

        this.decoration = this.editor.deltaDecorations([this.decoration], [lineDecoration])
        monaco.editor.setModelMarkers(this.editor.getModel(), "test", [marker])
    }
    componentDidMount() {
        // if (!this.props.issues) {
        //     return
        // }
        this.issuesSubscription = this.issues.subscribe(issue => this.setDecorationForIssue(issue))
    }
    componentWillReceiveProps(props) {
        // This is bad. Only editor should be able to change the content.
        // However interactive board should be able to change it too. Hmm..

        // if (props.content !== this.props.content) {
        //     console.log("Setting value")
        //     this.editor.setValue(props.content)
        // }

        if (props.issues !== this.props.issues) {
            console.log("Subscribing to new issues")
            if (this.issuesSubscription) {
                this.issuesSubscription.unsubscribe()
            }
            this.issuesSubscription = props.issues.subscribe(issue => this.setDecorations([issue]))
        }
    }
    renderIssue(issue, element) {
        ReactDOM.render(<Issue {...issue} />, element)
    }
    render() {
        return (
            <div className="editor-container">
                <div style={{ width: "100%", height: "100%" }} ref={this._mount} />
            </div>
        )
    }
}

const Issue = (props) => (
    <div className={`message ${props.severity}`}><span>{props.message}</span></div>
)

const severityTable = {
    "error": monaco.Severity.Error,
    "warning": monaco.Severity.Warning,
    "info": monaco.Severity.Info
}