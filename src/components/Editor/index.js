import React, { PureComponent } from "react"
import ReactDOM from "react-dom"
import { isFunction } from "lodash-es"
import FontFaceObserver from "fontfaceobserver"

import "./style.sass"

// TODO: simplify this
import { monaco, language, provider, theme } from "../MonacoEditor"
monaco.languages.register(language)
monaco.languages.setMonarchTokensProvider("moniel", provider)
monaco.editor.defineTheme("moniel", theme)

export default class Editor extends PureComponent {
    container = null
    editor = null
    decorations = []
    viewZones = []
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
            theme: "moniel",
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
            scrollbar: {
                useShadows: true,
                verticalScrollbarSize: 5,
                horizontalScrollbarSize: 5
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
                fn(code)
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
                    fn.apply(null, [editor])
                }
                return null;
            }
        });
    }
    setDecorations(issues) {
        if (!issues) {
            return
        }

        // max one error, otherwise it is confusing
        issues = issues.filter((v, i) => i == 0)

        const markers = issues.map(issue => ({
            startLineNumber: issue.startLineNumber,
            startColumn: issue.startColumn,
            endLineNumber: issue.endLineNumber,
            endColumn: issue.endColumn,
            message: issue.message,
            severity: severityTable[issue.severity]
        }))

        const lineDecorations = issues.map(issue => ({
            range: new monaco.Range(issue.startLineNumber, issue.startColumn, issue.startLineNumber,issue. startColumn),
            options: {
                isWholeLine: true,
                className: `inlineDecoration ${issue.severity}`,
                glyphMarginClassName: `glyphDecoration ${issue.severity}`,
                glyphMarginHoverMessage: issue.message
            }
        }))

        this.editor.changeViewZones(changeAccessor => {
            this.viewZones.forEach(zone => {
                changeAccessor.removeZone(zone)
            })
            this.viewZones = issues.map(issue => {
                const domNode = document.createElement("div")
                this.renderIssue(issue, domNode)
                const viewZoneId = changeAccessor.addZone({
                    afterLineNumber: issue.startLineNumber,
                    afterColumn: 0,
                    heightInLines: 0,
                    domNode: domNode
                })
                return viewZoneId
            })
        })

        this.decorations = this.editor.deltaDecorations(this.decorations, lineDecorations);
        monaco.editor.setModelMarkers(this.editor.getModel(), "test", markers)
    }
    componentWillReceiveProps(props) {
        // This is bad. Only editor should be able to change the content.
        // However interactive board should be able to change it too. Hmm..

        // if (props.content !== this.props.content) {
        //     console.log("Setting value")
        //     this.editor.setValue(props.content)
        // }

        if (props.issues !== this.props.issues) {
            this.setDecorations(props.issues)
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
    <div className={`message ${props.severity}`}>{props.message}</div>
)

const severityTable = {
    "error": monaco.Severity.Error,
    "warning": monaco.Severity.Warning,
    "info": monaco.Severity.Info
}