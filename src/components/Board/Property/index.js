import React, { PureComponent } from "react"

import Code from "../Code"

import "./style.sass"

export default class Value extends PureComponent {
    render() {

        return (
            <div className={`property ${this.props.type}`}>
                <div className="header">
                    <div className="cell name">
                        <Code>{this.props.name}</Code>
                    </div>
                    <div className="cell literal">
                        <Code>{this.props.literal}</Code>
                    </div>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}