import * as tf from "@tensorflow/tfjs"
import * as mnist from "mnist"

class StandardLibrary {
    Tensor = tf.tensor
    Variable = tf.variable
    Assign = ({ tensor, value }) => {
        tensor.assign(value)
        return tensor
    }
    Shape = (tensor) => tf.tensor(tensor.shape)
    Rank = (tensor) => tf.scalar(tensor.rank)
    Size = (tensor) => tf.scalar(tensor.size)

    Mean = ({ tensor, axis }) => {
        axis = this.ConvertToNative(axis)
        return tf.mean(tensor, axis)
    }
    Sum = ({ tensor, axis }) => {
        axis = this.ConvertToNative(axis)
        return tf.sum(tensor, axis)
    }
    Min = ({ tensor, axis }) => {
        axis = this.ConvertToNative(axis)
        return tf.min(tensor, axis)
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
    Reshape = ({ tensor, shape }) => {
        shape = this.ConvertToNative(shape)
        return tf.reshape(tensor, shape)
    }
    Squeeze = ({ tensor, axis }) => {
        axis = this.ConvertToNative(axis)
        return tf.squeeze(tensor, axis)
    }
    SqueezeAll = (tensor) => {
        return tf.squeeze(tensor)
    }
    Transpose = (tensor) => {
        return tf.transpose(tensor)
    }
    ExpandDimension = ({ tensor, axis = tf.scalar(0) }) => {
        axis = this.ConvertToNative(axis)
        return tf.expandDims(tensor, axis)
    }
    ResizeBilinear = ({ tensor, shape }) => {
        shape = shape || this.Shape(tensor)
        shape = this.ConvertToNative(shape)
        return tf.image.resizeBilinear(tensor, shape)
    }
    MaxPool = ({ tensor, filterSize, strides }) => {
        filterSize = this.ConvertToNative(filterSize)
        strides = this.ConvertToNative(strides)
        return tf.maxPool(tensor, filterSize, strides, "same")
    }
    Tile = ({ tensor, reps }) => {
        reps = this.ConvertToNative(reps)
        return tf.tile(tensor, reps)
    }
    Slice = ({ tensor, begin, size }) => {
        begin = this.ConvertToNative(begin)
        size = this.ConvertToNative(size)
        return tf.slice(tensor, begin, size)
    }

    // Arithmetics
    Negative = tf.neg
    Add = ({a, b}) => tf.add(a, b)
    Subtract = ({a, b}) => tf.sub(a, b)
    Multiply = ({a, b}) => tf.mul(a, b)
    Divide = ({a, b}) => tf.div(a, b)
    Modulus = ({a, b}) => tf.mod(a, b)
    Power = ({a, b}) => tf.pow(a, b)
    MatrixMultiply = ({a, b}) => tf.matMul(a, b)
    Square = tf.square
    SquareRoot = tf.sqrt
    Reciprocal = tf.reciprocal
    Sign = tf.sign
    Floor = tf.floor
    Ceiling = tf.ceil
    Round = tf.round
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
    RandomNormal = ({ shape = tf.tensor([1]), mean = tf.scalar(0), stdDev = tf.scalar(1) }) => {
        shape = this.ConvertToNative(shape)
        mean = this.ConvertToNative(mean)
        stdDev = this.ConvertToNative(stdDev)
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
    Iota = (value) => {
        value = this.ConvertToNative(value)
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
        return tf.tensor(mnist[classes].get()).reshape([28, 28])
    }

    Gradient = tf.grad // NOPE, not yet  =D

    ConvertToNative = (tensor) => {
        const isTensor = (tensor instanceof tf.Tensor)
        if (!isTensor) {
            throw new Error(`Only tensors can be converted to native type.`)
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

const library = new StandardLibrary()
export default library