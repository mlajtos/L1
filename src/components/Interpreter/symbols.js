export const toSymbol = (tag) => Symbol.for(tag)

const Symbols = {
    meta: toSymbol("meta"),
    doc: toSymbol("doc"),
    call: toSymbol("call"),
    // value: toSymbol("value"),
    true: toSymbol("true"),
    false: toSymbol("false")
}

export default Symbols