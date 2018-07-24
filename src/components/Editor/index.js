import React, { PureComponent } from "react"
import ReactDOM from "react-dom"
import { isFunction } from "lodash-es"
import FontFaceObserver from "fontfaceobserver"
import { Subject } from "rxjs"
import { scan } from "rxjs/operators"

import "./style.sass"

import monaco from "../MonacoEditor"

export default class Editor extends PureComponent {
    static defaultProps = {
        onChange: () => {},
        onExecute: () => {},
        defaultValue: "",
        language: "L1",
        readOnly: false,
        tabSize: 4
    }

    container = null
    editor = null

    decorations = []
    viewZones = []
    markers = []

    issues = new Subject

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
            tabSize: this.props.tabSize,
            readOnly: this.props.readOnly,
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
            const fn = this.props.onChange
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
                const fn = this.props.onExecute
                if (isFunction(fn)) {
                    this.issues.next(null)
                    fn.apply(null, [editor, this.issues])
                }
                return null;
            }
        })

        this.subscribeToIssues()
    }
    setDecorations = (issues) => {
        const markers = issues.map(issueToMarker)
        const lineDecorations = issues.map(issueToLineDecoration)

        this.editor.changeViewZones(changeAccessor => {
            this.viewZones.forEach(viewZone => changeAccessor.removeZone(viewZone))

            this.viewZones = issues.map(issue => {
                const domNode = document.createElement("div")
                this.renderIssue(issue, domNode)

                return changeAccessor.addZone({
                    afterLineNumber: issue.startLineNumber,
                    // afterColumn: 0,
                    heightInLines: 0,
                    domNode
                })
            })
        })

        this.decorations = this.editor.deltaDecorations(this.decorations, lineDecorations)
        monaco.editor.setModelMarkers(this.editor.getModel(), "test", markers)
    }
    subscribeToIssues() {
        this.issues.pipe(
            scan(
                (acc, curr) => ((curr === null) ? [] : [...acc, curr]),
                []
            )
        ).subscribe(this.setDecorations)
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

const issueToMarker = (issue) => ({
    startLineNumber: issue.startLineNumber,
    startColumn: issue.startColumn,
    endLineNumber: issue.endLineNumber,
    endColumn: issue.endColumn,
    message: issue.message,
    severity: severityTable[issue.severity]
})

const issueToLineDecoration = (issue) => ({
    range: new monaco.Range(
        issue.startLineNumber,
        issue.startColumn,
        issue.startLineNumber,
        issue.startColumn
    ),
    options: {
        isWholeLine: true,
        className: `inlineDecoration ${issue.severity}`,
        glyphMarginClassName: `glyphDecoration ${issue.severity}`,
        glyphMarginHoverMessage: issue.message
    }
})