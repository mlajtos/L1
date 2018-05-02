const tests = require.context("./__tests__/", true, /.*/)

const runTests = (ctx, callback) => {
    ctx.keys().forEach(test => callback(test, ctx))
}

runTests(tests, (test, ctx) => {
    try {
        ctx(test)
    } catch (e) {
        console.log(test, e)
    }
})