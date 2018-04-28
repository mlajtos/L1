// import { existsSync, writeFileSync, readFileSync, readdirSync, statSync } from "fs"
// import { join } from "path"

import Parser from "../../components/Parser"

import source from "./source.mon"
console.log(source)

import { equal } from "assert";
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        equal([1,2,3].indexOf(4), -1);
    });
  });
});

// const loadSnapshot = (filePath, target) => {
//     if (!existsSync(filePath)) {
//         writeFileSync(filePath, JSON.stringify(target, null, 2))
//     }

//     return JSON.parse(readFileSync(filePath, "utf8"))
// }

// describe("Parser", () => {
//     const testsDir = __dirname
//     const testDirectories = readdirSync(testsDir)
//         .filter(file => statSync(join(testsDir, file)).isDirectory())

//     testDirectories.forEach(d => {
//         const testDirectory  = join(testsDir, d)
//         const source = readFileSync(join(testDirectory, "source.mon"), "utf8")
//         const parseResultFilePath = join(testDirectory, "parseResult.json")

//         const generated = parse(source)
//         const target = loadSnapshot(parseResultFilePath, generated)

//         test(d, () => {
//             expect(generated).toEqual(target)
//         })
//     })
// })