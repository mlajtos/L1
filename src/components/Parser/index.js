import ohm from "ohm-js"
import grammar from "./grammar.ohm"
import semantics from "./semantics.js"

class Parser {
    grammar = null
    semantics = null
    constructor() {
        this.grammar = ohm.grammar(grammar)
        this.semantics = this.grammar.createSemantics().addOperation(semantics.operation, semantics.actions)
    }
    parse = (code) => {
        return new Promise(resolve => {
            const result = this.parseSync(code)
            resolve(result)
        })
    }
    parseSync = (code) => { 
        const match = this.grammar.match(code)
        const success = match.succeeded()
        if (success) {
            const semanticMatch = this.semantics(match)
            const result = semanticMatch[semantics.operation].call(semanticMatch)
            return {
                result,
                issues: []
            }
        } else {
            return {
                result: null,
                issues: [{
                    ...convertToLineNumberAndColumn(code, match.getRightmostFailurePosition()),
                    message: "Expected " + match.getExpectedText(),
                    severity: "error"
                }]
            }
        }
    }
}

export default new Parser

export const convertToLineNumberAndColumn = (code, startOffset, endOffset) => {
    endOffset = endOffset || startOffset

    const start = getLineAndColumn(code, startOffset)
    const end = getLineAndColumn(code, endOffset)
    return {
        startLineNumber: start.lineNum,
        startColumn: start.colNum,
        endLineNumber: end.lineNum,
        endColumn: end.colNum,
        _value: code.substring(startOffset, endOffset)
    }
}

// import { getLineAndColumn } from "ohm/src/util"
export const getLineAndColumn = function(str, offset) {
    var lineNum = 1;
    var colNum = 1;
  
    var currOffset = 0;
    var lineStartOffset = 0;
  
    var nextLine = null;
    var prevLine = null;
    var prevLineStartOffset = -1;
  
    while (currOffset < offset) {
      var c = str.charAt(currOffset++);
      if (c === '\n') {
        lineNum++;
        colNum = 1;
        prevLineStartOffset = lineStartOffset;
        lineStartOffset = currOffset;
      } else if (c !== '\r') {
        colNum++;
      }
    }
  
    // Find the end of the target line.
    var lineEndOffset = str.indexOf('\n', lineStartOffset);
    if (lineEndOffset === -1) {
      lineEndOffset = str.length;
    } else {
      // Get the next line.
      var nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
      nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset)
                                          : str.slice(lineEndOffset, nextLineEndOffset);
      // Strip leading and trailing EOL char(s).
      nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
    }
  
    // Get the previous line.
    if (prevLineStartOffset >= 0) {
      prevLine = str.slice(prevLineStartOffset, lineStartOffset)
                    .replace(/\r?\n$/, '');  // Strip trailing EOL char(s).
    }
  
    // Get the target line, stripping a trailing carriage return if necessary.
    var line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');

    return {
      lineNum: lineNum,
      colNum: colNum,
      line: line,
      prevLine: prevLine,
      nextLine: nextLine
    };
  };