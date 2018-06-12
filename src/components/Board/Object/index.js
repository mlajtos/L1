import React, { PureComponent } from "react"

import { get, has } from "lodash-es"

import ObjectProperty from "../ObjectProperty"
import PropertyWrapper from "../PropertyWrapper"
import Markdown from "../Markdown"
import Symbols from "../../Interpreter/symbols"

import "./style.sass"

const _m = Symbols.meta
const _doc = Symbols.doc

/*
    `Object.betterEntries(obj)` returns array of triplets [value, key, obj],
    so it is aligned with `Array.filter` and `Array.map` with signatures
    of [elem, index, array]
*/

Object.betterEntries = (obj) => {
    const entries = Object.entries(obj)
    return entries.map(([key, value]) => [value, key, obj])
}

// use _.get
const isSilent = ([value, key, props]) => !(props[_m] && props[_m][key] && props[_m][key].silent)

export default class ObjectVis extends PureComponent {
    render() {
        const { data } = this.props

        const props = Object.betterEntries(data)
            .filter(isSilent)
            .map(([value, key, props]) => {
                // use _.get
                const _meta = (props[_m] && props[_m][key]) ? props[_m][key] : null

                return (
                    <ObjectProperty {...{
                        key,
                        name: key,
                        data: value,
                        _meta
                    }} />
                )
            })

        const hasDoc = data.hasOwnProperty(Symbols.doc)
        const doc = hasDoc ? <Markdown>{data[_doc]}</Markdown> : null

        return (
            <PropertyWrapper type="object" symbol="{}" {...this.props}>
                <div className="properties">
                    {doc}
                    {props}
                </div>
            </PropertyWrapper>
        )
    }
}