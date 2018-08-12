import React, { PureComponent } from "react"

import { normalizeTensor, formatNumber } from "../index"

import "./style.sass"

export default class SvgTensor extends PureComponent {
    render = () => {
        const { props } = this

        const [height, width] = ((tensorShape) => {
            const [h = 1, w = 1] = tensorShape
            return [h, w]
        })(props.data.shape)

        const normalized = normalizeTensor(props.data)
        const normalizedData = normalized.dataSync()
        const data = props.data.dataSync()

        const size = props.data.size

        const tileHeight = 40
        const tileWidth = 40

        const svgWidth = tileWidth * width
        const svgHeight = tileHeight * height

        return (
            <div style={{ flex: 1 }}>
                <svg className="svg-tensor" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                    {
                        Array.from({ length: size }, (_, i) => {

                            const color = normalizedData[i]
                            const bgColor = `rgb(${color}, ${color}, ${color})`
                            const inverseRoundedValue = color > 128 ? 0 : 255
                            const fgColor = `rgb(${inverseRoundedValue}, ${inverseRoundedValue}, ${inverseRoundedValue})`
                            const dx = tileWidth * (i % width)
                            const dy = tileHeight * Math.floor(i / width)

                            return (
                                <g key={i} transform={`translate(${dx}, ${dy})`}>
                                    <rect width={tileWidth} height={tileHeight} fill={bgColor} />
                                    <text x={tileWidth / 2} y={tileHeight / 2} textAnchor="middle" dominantBaseline="central" fill={fgColor}>{formatNumber(data[i], 1)}</text>
                                </g>
                            )
                        })
                    }
                </svg>
            </div>
        )
    }
}