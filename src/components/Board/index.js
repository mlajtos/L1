import React, { PureComponent } from "react"

import Object from "./Object"
import ObjectPropery from "./ObjectProperty"

export default class Board extends PureComponent {
    render() {
        // if (!this.props.data) {
        //     return null
        // }
        
        return (
            <ObjectPropery data={this.props.data} type={"panel"} />
        )
    }
}