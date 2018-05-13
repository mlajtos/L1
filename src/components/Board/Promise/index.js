import React, { PureComponent } from "react"
import * as tf from "@tensorflow/tfjs"


import ObjectProperty from "../ObjectProperty"
import PropertyWrapper from "../PropertyWrapper"

const isPromise = (value) => (value.toString() === "[object Promise]")

export default class Promise extends PureComponent {
    state = {
        data: null,
        loading: false
        // data: tf.tensor([1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 3])
    }
    // static async getDerivedStateFromProps(nextProps, prevState) {
    //     const data = await nextProps.data
    //     return { data }
    // //     const newData = nextProps.data
    // //     const currData = prevState.data
        
    // //     if (newData === currData) {
    // //         return null
    // //     }

    // //     return {
    // //         data: newData
    // //     }
    // }

    componentDidMount() {
        if (isPromise(this.props.data)) {
            this.props.data.then(data => {
                // console.log("Promise resolved from componentDidMount", data)
                this.setState({ data })
            })
        }
    }

    // async componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log("componentDidUpdate", "prevProps.data", prevProps.data, "props.data", this.props.data, "state.data", this.state.data)

    //     if (this.props.data !== prevProps.data) {
    //       this.setState({loading: true}) // <-- will immediately cause another render after we *just* updated
    //       if (this.props.data instanceof Promise) {
    //           console.log(`Waiting for a promise`)
    //           const data = await this.props.data
    //           console.log(`Setting data to `, data)
    //           this.setState({loading: false, data })
    //       }
    //     }
    //   }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            if (isPromise(this.props.data)) {
                this.props.data.then(data => {
                    // console.log("Promise resolved from componentDidUpdate", data)
                    this.setState({ data })
                })
            }
        }
    }

    async handlePromise() {
        const data = await this.props.data
        // console.log("handlePromise", data)
        this.setState({ data })
    }

    render() {
        let data

        if (!(isPromise(this.props.data))) {
            // console.log("Not a promise", this.props.data, this.props.data.toString())
            data = this.props.data
        } else {
            // console.log("have a promise", this.props.data)
            data = this.state.data
        }

        return (
            <ObjectProperty {...this.props} data={data} />
        )
    }
}