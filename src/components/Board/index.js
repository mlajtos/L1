import React, { PureComponent } from "react"

import Object from "./Object"

export default class Board extends PureComponent {
    render() {
        if (!this.props.data) {
            return null
        }
        
        return (
            <Object data={this.props.data} type={"panel"} />
        )
    }
}