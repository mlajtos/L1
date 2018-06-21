import Parser from "../Parser"
import Interpreter from "../Interpreter"

class Evaluator {
    evaluate = async (code, env = {}, issues) => {
        const parsingResult = await Parser.parse(code, issues)
        const ast = parsingResult.result || null
        const interpretingResult = ast ? await Interpreter.interpret(ast, env, issues) : null
        const computedValues = interpretingResult ? interpretingResult.success.result || [] : null

        return {
            code,
            ast,
            computedValues
        }
    }
}

export default new Evaluator