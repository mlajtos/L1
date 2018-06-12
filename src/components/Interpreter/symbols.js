export const toSymbol = (tag) => Symbol.for(tag)

const Symbols = {
    meta: toSymbol("meta"),
    doc: toSymbol("doc"),
    call: toSymbol("call"),
    true: toSymbol("true"),
    false: toSymbol("false")
}

export default Symbols