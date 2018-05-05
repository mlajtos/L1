import ReactDOM from "react-dom"
import React from "react"
import Studio from "./components/Studio"

self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return './json.worker.js';
        }
        // if (label === 'css') {
        // 	return './css.worker.js';
        // }
        // if (label === 'html') {
        // 	return './html.worker.js';
        // }
        // if (label === 'typescript' || label === 'javascript') {
        // 	return './ts.worker.js';
        // }
        return './editor.worker.js';
    }
}

ReactDOM.render(<Studio />, document.querySelector("#studio"))

module.hot.accept()