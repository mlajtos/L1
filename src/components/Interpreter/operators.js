export const OPERATORS = {
    "1": {
        "'": "ConvertToNative",
        "-": "Negative",
        "/": "Reciprocal"
    },
    "2": {
        "+": "Add",
        "-": "Subtract",
        "*": "Multiply",
        "×": "Multiply",
        "/": "Divide",
        "÷": "Divide",
        "^": "Power",
        "%": "Modulus",
        "@": "MatrixMultiply",

        ".": "PropertyAccess"
        // TODO: strict versions should be ++, --, **, //, etc. (if they are needed)
    }
}