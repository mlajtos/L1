import React, { PureComponent } from "react"

import Code from "../Code"

import "./style.sass"

export default class Property extends PureComponent {
    onMouseOver = (e) => {
        console.log(this.props.source)
    }
    render() {

        return (
            <div className={`property ${this.props.type}`} onMouseOver={this.onMouseOver}>
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