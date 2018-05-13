import React, { PureComponent } from "react"

import Code from "../Code"

import "./style.sass"

export default class PropertyWrapper extends PureComponent {
    onMouseOver = (e) => {
        // console.log(this.props.source)
    }
    render() {

        const name = this.props.name || "???"
        const literal = this.props.literal || ""
        const type = this.props.type || ""

        return (
            <div className={`property ${type}`} onMouseOver={this.onMouseOver}>
                <div className="header">
                    <div className="cell name">
                        <Code>{name}</Code>
                    </div>
                    <div className="cell literal">
                        <Code>{literal}</Code>
                    </div>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}