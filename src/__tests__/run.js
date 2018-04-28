// import { existsSync, writeFileSync, readFileSync, readdirSync, statSync } from "fs"
// import { join } from "path"

import grammar from "../components/Parser/grammar.ohm"

console.log(grammar)

import Parser from "../components/Parser"

const loadSnapshot = (filePath, target) => {
    if (!existsSync(filePath)) {
        writeFileSync(filePath, JSON.stringify(target, null, 2))
    }

    return JSON.parse(readFileSync(filePath, "utf8"))
}

describe("Parser", () => {
    const testsDir = __dirname
    const testDirectories = readdirSync(testsDir)
        .filter(file => statSync(join(testsDir, file)).isDirectory())

    testDirectories.forEach(d => {
        const testDirectory  = join(testsDir, d)
        const source = readFileSync(join(testDirectory, "source.mon"), "utf8")
        const parseResultFilePath = join(testDirectory, "parseResult.json")

        const generated = parse(source)
        const target = loadSnapshot(parseResultFilePath, generated)

        test(d, () => {
            expect(generated).toEqual(target)
        })
    })
})