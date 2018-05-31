import * as tf from "@tensorflow/tfjs-core"
//import * as mnist from "mnist"
import { flow, get, hasIn } from "lodash-es"

class Variable extends tf.Variable {
    _mutationObservers = []
    assign(newValue) {
        super.assign(newValue)
        this.notify()
    }
    subscribe(fn) {
        this._mutationObservers.push(fn)
    }
    unsubscribe(fn) {
        this._mutationObservers = this._mutationObservers.filter(mo => mo !== fn)
    }
    notify() {
        this._mutationObservers.forEach(mo => mo.call())
    }
}

class Scope {
    [Symbol.for("meta")] = {}

    PropertyAccess = ({ a, b }) => {
        const found = hasIn(a, b)
        if (!found) {
            throw new Error(`No such thing.`)
        }
        return get(a, b)
    }

    Tensor = tf.tensor
    Variable = async (tensor) => new Variable(await tensor)
    Assign = async ({ tensor, value }) => {
        tensor = await tensor
        tensor.assign(await value)
        return tensor
    }
    Shape = (tensor) => tf.tensor(tensor.shape)
    Rank = (tensor) => tf.scalar(tensor.rank)
    Size = (tensor) => tf.scalar(tensor.size)

    Mean = async (args) => {
        if (!args) { // Mean ?
            return this.Mean
        }

        if (args.axis) {
            const axis = await args.axis
            const axis_n = await this.ConvertToNative(axis)

            if (args.tensor) {
                const tensor = await args.tensor
                return tf.mean(tensor, axis_n)
            }

            return async (tensor) => this.Mean({ tensor, axis })
        }
    }
    Sum = async (args) => {
        if (!args) { // Sum ?
            return this.Sum
        }

        if (args.axis) {
            const axis = await args.axis
            const axis_n = await this.ConvertToNative(axis)

            if (args.tensor) {
                const tensor = await args.tensor
                return tf.sum(tensor, axis_n)
            }

            return async (tensor) => this.Sum({ tensor, axis })
        }
    }
    Min = async ({ tensor, axis = tf.scalar(0) }) => {
        axis = await this.ConvertToNative(await axis)
        return tf.min(await tensor, await axis)
    }

    /*

        Reshape { input: tensor, shape: [100 100] }     # ukecané
        Reshape {shape: [100 100]} tensor               # Re-shape-shape 
        Reshape [100 100] tensor                        # hm
        tensor -> Reshape [100 100]                     # ok
        tensor -> Reshape { shape: [100 100] }          # ukecané
        tensor.reshape([100, 100])                      # orig

    */

    // Shape shifters
    Reshape = async ({ tensor, shape }) => {
        shape = tf.tensor([tensor.shape])
        shape = await this.ConvertToNative(await shape)
        return tf.reshape(await tensor, await shape)
    }
    Squeeze = async ({ tensor, axis }) => {
        axis = await this.ConvertToNative(await axis)
        return tf.squeeze(await tensor, await axis)
    }
    SqueezeAll = async (tensor) => {
        return tf.squeeze(await tensor)
    }
    Transpose = async (tensor) => {
        return tf.transpose(await tensor)
    }
    ExpandDimension = async (args) => {
        console.log("Expand dimension:", args)
        if (!args) { // ExpandDimension ?
            return this.ExpandDimension
        }

        if (args.axis) {
            const axis = await args.axis
            const axis_n = await this.ConvertToNative(axis)

            if (args.tensor) {
                const tensor = await args.tensor
                return tf.expandDims(tensor, axis_n)
            }

            return async (tensor) => this.ExpandDimension({ tensor, axis })
        }

        throw new Error(`Expected axis parameter.`)
        
    }
    // ExpandDimension = async ({ tensor, axis = tf.scalar(0) }) => {
    //     const axis_n = await this.ConvertToNative(await axis)

    //     if (tensor) {
    //         tensor = await tensor
    //         return tf.expandDims(tensor, axis_n)
    //     }

    //     //return async (tensor) => tf.expandDims(tensor, axis)
    //     return async (tensor) => this.ExpandDimension({ tensor, axis })
    // }
    RankUp = async (tensor) => {
        return tf.expandDims(await tensor, 0)
    }
    ResizeBilinear = async ({ tensor, shape }) => {
        shape = shape || this.Shape(await tensor)
        shape = await this.ConvertToNative(await shape)
        return tf.image.resizeBilinear(await tensor, await shape)
    }
    MaxPool = async ({ tensor, filterSize = tf.scalar(1), strides = tf.scalar(1) }) => {
        filterSize = await this.ConvertToNative(await filterSize)
        strides = await this.ConvertToNative(strides)
        return tf.maxPool(await tensor, await filterSize, await strides, "same")
    }
    Convolution2D = async ({ tensor, filter, strides = tf.scalar(1) }) => {
        strides = this.ConvertToNative(await strides)
        return tf.conv2d(await tensor, await filter, await strides, "same")
    }
    Tile = async ({ tensor, reps }) => {
        reps = await this.ConvertToNative(await reps)
        return tf.tile(await tensor, await reps)
    }
    Slice = async ({ tensor, begin, size }) => {
        begin = this.ConvertToNative(await begin)
        size = this.ConvertToNative(await size)
        return tf.slice(await tensor, await begin, await size)
    }

    // Arithmetics
    Negative = tf.neg
    Add = ({ a, b }) => tf.add(a, b)
    Subtract = ({ a, b }) => tf.sub(a, b)
    Multiply = ({ a, b }) => tf.mul(a, b)
    Divide = ({ a, b }) => tf.div(a, b)
    Modulus = ({ a, b }) => tf.mod(a, b)
    Power = ({ a, b }) => tf.pow(a, b)
    MatrixMultiply = ({ a, b }) => tf.matMul(a, b)
    Square = tf.square
    SquareRoot = tf.sqrt
    Reciprocal = tf.reciprocal
    Sign = tf.sign
    Floor = tf.floor
    Ceiling = tf.ceil
    Round = async (tensor) => tf.round(await tensor)
    Absolute = tf.abs
    Logarithm = tf.log

    // Trigonometry
    Sine = tf.sin
    Cosine = tf.cos
    Tangent = tf.tan
    ArcusSine = tf.asin
    ArcusCosine = tf.acos
    ArcusTangent = tf.atan

    // Activation Functions
    ExponentialLinearUnit = tf.elu
    RectifiedLinearUnit = tf.relu
    Sigmoid = tf.sigmoid
    Softmax = tf.softmax
    Softplus = tf.softplus

    // Generators
    RandomNormal = async ({ shape = tf.tensor([1]), mean = tf.scalar(0), stdDev = tf.scalar(1) }) => {
        console.log(shape)
        shape = await this.ConvertToNative(shape)
        mean = await this.ConvertToNative(mean)
        stdDev = await this.ConvertToNative(stdDev)
        return tf.randomNormal(shape, mean, stdDev)
    }
    RandomUniform = ({ shape, min = tf.scalar(0), max = tf.scalar(1), dtype }) => {
        shape = this.ConvertToNative(shape)
        min = this.ConvertToNative(min)
        max = this.ConvertToNative(max)
        return tf.randomUniform(shape, min, max, dtype)
    }
    LinearSpace = ({ start = tf.scalar(0), stop = tf.scalar(1), num = tf.scalar(10) }) => {
        start = this.ConvertToNative(start)
        stop = this.ConvertToNative(stop)
        num = this.ConvertToNative(num)
        return tf.linspace(start, stop, num)
    }
    Iota = async (value) => {
        value = await this.ConvertToNative(value)
        return tf.linspace(1, value, value)
    }
    Ones = (shape) => {
        shape = this.ConvertToNative(shape)
        return tf.ones(shape)
    }
    Zeros = (shape) => {
        shape = this.ConvertToNative(shape)
        return tf.zeros(shape)
    }

    GetDigit = (classes = tf.scalar(0)) => {
        classes = this.ConvertToNative(classes)
        // return tf.tensor(mnist[classes].get()).reshape([28, 28])
    }

    Gradient = (f) => {
        return tf.grad(f)
    }
    StochasticGradientDescent = async ({
            learningRate = tf.scalar(1),
            maxIterations = tf.scalar(10),
            maxTime = tf.scalar(1000)
        }) => {
        learningRate = await this.ConvertToNative(await learningRate)
        maxIterations = await this.ConvertToNative(await maxIterations)
        maxTime = await this.ConvertToNative(await maxTime)

        const optimizer = tf.train.sgd(learningRate)
        const minimize = optimizer.minimize.bind(optimizer)

        const optimize = async (lossFn) => {
            lossFn = await lossFn
            const losses = []
            const mu = new Variable(tf.tensor1d([]))
            const t0 = performance.now()
            for (let i = 0; i < maxIterations; i++) {
                const u0 = performance.now()
                const loss = await lossFn.call()
                const cost = minimize((() => loss), true)
                losses.push(await this.RankUp(await loss))
                //mu.assign(tf.concat(await Promise.all(losses)))
                const u1 = performance.now()

                const timePerIteration = u1 - u0
                const totalTime = u1 - t0

                //console.log("timePerIteration", timePerIteration)
                //console.log("totalTime", totalTime)

                if (totalTime > maxTime) {
                    break;
                }
                await tf.nextFrame()
            }
            //return mu
            return tf.concat(await Promise.all(losses))
        }

        return optimize
    }

Flow = async ({ fn = async a => a, count = tf.scalar(1) }) => {
    fn = await fn
    count = await this.ConvertToNative(count)
    return flow(Array.from({ length: count }, (v, i) => fn))
}

ConvertToNative = async (tensor) => {
    tensor = await tensor
    const isTensor = (tensor instanceof tf.Tensor)
    if (!isTensor) {
        throw new Error(`Only tensors can be converted to native type.`)
        console.log(tensor)
        return
    }
    const data = await tensor.data()
    if (tensor.rank === 0 && tensor.size === 1) {
        return data[0]
    }
    return Array.from(data)
}

}

// const registerMaxPool = () => {
//     return registerFunction({
//         description = {
//             config: {
//                 tensor: "The input tensor, of rank 4 or rank 3 of shape [batch, height, width, inChannels]. If rank 3, batch of 1 is assumed.",
//                 filterSize: "The filter size, a tuple [filterHeight, filterWidth]",
//                 stride: "The strides of the pooling: [strideHeight, strideWidth]"
//             }
//         },
//         implementation = tf.maxPool(config.tensor, config.filterSize, config.strides, "same")
//     })
// }

const library = new Scope()
export default library