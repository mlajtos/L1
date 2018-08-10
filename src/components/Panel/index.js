import React, { PureComponent } from "react"

import "./style.sass"

export default class Panel extends PureComponent {
    state = {
        scrolled: false
    }
    onScroll = (e) => {
        if (e.target.scrollTop > 0 && !this.state.scrolled) {
            this.setState({
                scrolled: true
            })
            return
        }

        if (e.target.scrollTop === 0 && this.state.scrolled) {
            this.setState({
                scrolled: false
            })
            return
        }
    }
    render() {
        const scrolled = this.props.scrollable && this.state.scrolled
        const className = "panel" + (scrolled ? " scrolled" : "") + (this.props.disabled ? " disabled" : "")

        return (
            <div id={this.props.id || ""} className={className} onScroll={this.props.scrollable ? this.onScroll : undefined}>
                { this.props.children }
            </div>
        )
    }
}