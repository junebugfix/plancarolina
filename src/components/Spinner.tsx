import * as React from 'react';

export default class Spinner extends React.Component<{ radius?: number, thickness?: number, style?: any }, {}> {
  render() {
    const size = this.props.radius ? this.props.radius * 2 : 20
    const thickness = this.props.thickness ? this.props.thickness : 2
    const style = {
      display: 'inline-block',
      boxSizing: 'border-box',
      borderRadius: '50%',
      position: 'absolute' as 'absolute',
      borderTop: `${thickness}px solid rgba(0,0,0,0.2)`,
      borderRight: `${thickness}px solid rgba(0,0,0,0.2)`,
      borderBottom: `${thickness}px solid rgba(0,0,0,0.2)`,
      borderLeft: `${thickness}px solid black`,
      animation: 'load8 800ms infinite linear',
      width: size,
      height: size
    }
    
    const afterStyle = {
      borderRadius: '50%',
      position: 'absolute' as 'absolute',
      width: size,
      height: size
    }

    Object.assign(style, this.props.style)

    return (
      <span className="undraggable" style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
        <div style={style}></div>
        <div style={afterStyle}></div>
      </span>
    )
  }
}