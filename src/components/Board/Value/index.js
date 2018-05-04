import React, { PureComponent } from "react"

import Colorize from "../../ColorizedCode"

import "./style.sass"

export default class Value extends PureComponent {
    render() {

        return (
            <div className="entity">
                <div className="name">
                    <Colorize>{this.props.name}</Colorize>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}