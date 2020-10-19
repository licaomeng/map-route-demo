import React, { PureComponent } from 'react'
import { CanvasOverlay } from 'react-map-gl';

class PolylineOverlay extends PureComponent {
  _redraw({ width, height, ctx, isDragging, project, unproject }) {
    const { points, color = 'red', lineWidth = 2, renderWhileDragging = true } = this.props
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = color
      ctx.beginPath()
      points.forEach(point => {
        const pixel = project([Number(point[1]), Number(point[0])])
        ctx.lineTo(pixel[0], pixel[1])
      })
      ctx.stroke()
    }
  }

  render() {
    return <CanvasOverlay redraw={this._redraw.bind(this)} />
  }
}

export default PolylineOverlay