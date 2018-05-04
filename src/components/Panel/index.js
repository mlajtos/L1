import React, { PureComponent } from "react"

import "./style.sass"

export default class Panel extends PureComponent {
    state = {
        hidden: ("hidden" in this.props) ? this.props.hidden : false
    }
    render() {

        return (
            <div className={`panel ` + (this.state.hidden ? "hidden" : "shown")}>
                <div className="panel-header">
                    <a onClick={ e => { this.setState({ hidden: !this.state.hidden }) } }>{this.props.name}</a>
                </div>
                <div className="panel-content">
                    {
                        this.state.hidden
                            ? null
                            : this.props.children
                    }
                </div>
            </div>
        )
    }
}