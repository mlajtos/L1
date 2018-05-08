import React, { PureComponent } from "react"

import Colorize from "../../ColorizedCode"

import "./style.sass"

export default class Value extends PureComponent {
    render() {

        return (
            <div className={`property ${this.props.type}`}>
                <div className="header">
                    <div className="cell name">
                        <Colorize>{this.props.name}</Colorize>
                    </div>
                    <div className="cell literal">
                        <Colorize>{this.props.literal}</Colorize>
                    </div>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}