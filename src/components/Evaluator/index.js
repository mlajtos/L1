import Parser from "../Parser"
import Interpreter from "../Interpreter"

class Evaluator {
    evaluate = async (code, env = {}, issues) => {
        const parsingResult = await Parser.parse(code, issues)
        const ast = parsingResult.result || undefined
        const interpretingResult = ast ? await Interpreter.interpret(ast, env, issues) : undefined
        const computedValues = interpretingResult ? interpretingResult.success.result || [] : {}

        return {
            code,
            ast,
            computedValues
        }
    }
}

export default new Evaluator