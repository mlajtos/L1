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

        return (
            <div className={"panel " + (this.state.scrolled ? "scrolled" : "")} onScroll={this.onScroll}>
                { this.props.children }
            </div>
        )
    }
}