// Post data to parent thread
// self.postMessage({ foo: "foo" })

// Respond to message from parent thread
// self.addEventListener("message", (event) => {
//     const code = event.data.code
// })

// From the main thread
// import Worker from "./test.worker"
// const worker = new Worker()
// worker.addEventListener("message", (event) => {
//     console.log("Message from worker", event)
// })
// worker.postMessage({ code })