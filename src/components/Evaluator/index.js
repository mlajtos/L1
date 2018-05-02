import Parser from "../Parser"
import Interpreter from "../Interpreter"

class Evaluator {
    evaluateSync = (code) => {
        const parsingResult = Parser.parseSync(code)
        const ast = parsingResult.result || null
        const parsingError =  parsingResult.error || null
        const interpretingResult = ast ? Interpreter.interpretSync(ast) : null
        const computedValues = interpretingResult ? interpretingResult.success.result || [] : []
    
        const parsingIssues = parsingResult.issues
        const interpretingIssues = interpretingResult ? interpretingResult.success.issues : []
    
        return {
            code,
            ast,
            computedValues,
            issues: [...parsingIssues, ...interpretingIssues]
        }
    }
}

export default new Evaluator