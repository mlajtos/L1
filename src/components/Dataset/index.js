
const loadFile = async (file) => {
    const data = await import("./data/" + file)
    const buffer = Buffer.from(Object.values(data))
    buffer.readUInt32BE(0) // skip magic number
    return buffer
}

export const loadTestLabels = async () => {
    const buffer = await loadFile("t10k-labels-idx1-ubyte.bin")
    const length = buffer.readUInt32BE(4)
    const labels = Array.from({ length }, (v, i) => buffer.readUInt8(8 + i))
    return labels
}

export const loadTestImages = async () => {
    const buffer = await loadFile("t10k-images-idx3-ubyte.bin")
    const length = buffer.readUInt32BE(4)
    const rows = buffer.readUInt32BE(8)
    const cols = buffer.readUInt32BE(12)
    console.log(rows, cols)
    const images = Array.from({ length }, (v, i) => {
        //const offset = 16 + Math.pow(28, 2)
    })

    return []

    // return labels
//   var images = _.range(m - n).map(function (i) {
//     var offset = 16 + Math.pow(28, 2) * i;
//     return _.range(28).map(function (j) {
//       return _.range(28).map(function (k) {
//         return buffer.readUInt8(offset + (28 * j) + k);
//       });
//     });
//   });
}