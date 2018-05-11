// import Evaluator from "./Evaluator"

// Post data to parent thread
self.postMessage({ foo: "foo" })

// Respond to message from parent thread
self.addEventListener("message", (event) => {
    const code = event.data.code
    //const result = Evaluator.evaluateSync(code)
    //console.log(result)
})