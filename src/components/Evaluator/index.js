import Parser from "../Parser"
import Interpreter from "../Interpreter"

class Evaluator {
    evaluate = async (code, env = {}) => {
        const parsingResult = await Parser.parse(code)
        const ast = parsingResult.result || null
        const parsingError =  parsingResult.error || null
        const interpretingResult = ast ? await Interpreter.interpret(ast, env) : null
        const computedValues = interpretingResult ? interpretingResult.success.result || [] : null
    
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