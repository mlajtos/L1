import React, { PureComponent } from "react"

import "./style.sass"

export default class Panel extends PureComponent {
    render() {

        return (
            <div className={"panel"}>
                { this.props.children }
            </div>
        )
    }
}