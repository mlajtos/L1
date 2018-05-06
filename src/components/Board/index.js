import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"

import Object from "./Object"

import "./style.sass"

export default class Board extends PureComponent {
    render() {
        return (
            <div className="board">
                <Object data={this.props.data} />
            </div>
        )
    }
}