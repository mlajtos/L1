import React, { PureComponent } from "react"

import Object from "./Object"

import "./style.sass"

export default class Board extends PureComponent {
    render() {
        if (!this.props.data) {
            return null
        }
        
        return (
            <div className="board">
                <Object data={this.props.data} name="Visualization" />
            </div>
        )
    }
}