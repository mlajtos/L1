import * as tf from "@tensorflow/tfjs"
import * as mnist from "mnist"

const runtimeEnvironment = {
    Tensor: tf.tensor, // noun
    Variable: tf.variable,
    Assign: ({ tensor, value }) => {
        tensor.assign(value)
        return tensor
    },
    Shape: (tensor) => tensor.shape, // noun

    Mean: tf.mean, // noun
    Sum: ({ tensor, axis }) => tf.sum(tensor, axis),
    Min: ({ tensor, axis }) => tf.min(tensor, axis),

    // Shape shifters
    Reshape: ({ tensor, shape }) => tf.reshape(tensor, shape), // noun
    /*

        Reshape {shape: [100 100]} tensor
        Reshape [100 100] tensor
        tensor -> Reshape [100 100]
        tensor -> Reshape { shape: [100 100] }
        tensor.reshape([100, 100])

    */
    Squeeze: ({ tensor, axis }) => tf.squeeze(tensor, axis),
    SqueezeAll: (tensor) => tf.squeeze(tensor),
    Transpose: tf.transpose,
    ExpandDimension: ({ tensor, axis }) => tf.expandDims(tensor, axis), // verb adverb
    ResizeBilinear: ({ tensor, shape }) => tf.image.resizeBilinear(tensor, shape),
    MaxPool: ({ tensor, filterSize, strides }) => tf.maxPool(tensor, filterSize, strides, "same"),
    Tile: ({ tensor, reps }) => tf.tile(tensor, reps),
    Slice: ({ tensor, begin, size }) => tf.slice(tensor, begin, size),

    // Arithmetics
    Negative: tf.neg, // noun OR Negate - verb
    Add: ({a, b}) => tf.add(a, b), // verb
    Subtract: ({a, b}) => tf.sub(a, b), // verb
    Multiply: ({a, b}) => tf.mul(a, b), // verb
    Divide: ({a, b}) => tf.div(a, b), // verb
    Modulus: ({a, b}) => tf.mod(a, b), // noun
    Power: ({a, b}) => tf.pow(a, b), // noun
    MatrixMultiply: ({a, b}) => tf.matMul(a, b), // ?,
    Square: tf.square,
    SquareRoot: tf.sqrt,
    Reciprocal: tf.reciprocal, // noun
    Sign: tf.sign, // noun
    Floor: tf.floor, // noun
    Ceiling: tf.ceil, // noun
    Round: tf.round, // verb
    Absolute: tf.abs,

    // Trigonometry
    Sine: tf.sin,
    Cosine: tf.cos,
    Tangent: tf.tan,
    ArcusSine: tf.asin,
    ArcusCosine: tf.acos,
    ArcusTangent: tf.atan,

    // Activation Functions
    ExponentialLinearUnit: tf.elu, // +-noun
    RectifiedLinearUnit: tf.relu, // +-noun
    Sigmoid: tf.sigmoid,
    Softmax: tf.softmax,
    Softplus: tf.softplus,
    
    // Generators
    RandomNormal: ({ shape = [1, 1], mean = 0, stdDev = 1 }) => tf.randomNormal(shape, mean, stdDev),
    RandomUniform: ({ shape, minval, maxval, dtype }) => tf.randomUniform(shape, minval, maxval, dtype),
    LinearSpace: ({ start = 0, stop = 1, num = 10 }) => tf.linspace(start, stop, num),
    Iota: (num) => tf.linspace(1, num, num),
    Ones: ({ shape }) => tf.ones(shape),
    Zeros: ({ shape }) => tf.zeros(shape),

    GetDigit: (classes) => tf.tensor(mnist[classes].get()).reshape([28, 28]),
    //GetDigit: (classes) => tf.randomNormal([28, 28]),

    Gradient: tf.grad, // NOPE, not yet :D

    ConvertToNative: (tensor) => {
        const isTensor = (tensor instanceof tf.Tensor)
        if (!isTensor) {
            console.error(`Only tensors can be converted to native type.`)
            console.log(tensor)
            return
        }
        const data = tensor.dataSync()
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

export default runtimeEnvironment