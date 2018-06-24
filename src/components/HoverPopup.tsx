import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import '../styles/HoverPopup.css'
import { dragController } from '../DragController'

@observer
export default class HoverPopup extends React.Component<{ hoverElement: HTMLElement }, {}> {
  container: HTMLElement

  activateMoreTag() {
    this.props.hoverElement.classList.add('active')
  }

  deactivateMoreTag() {
    this.props.hoverElement.classList.remove('active')
    this.hideExpansion()
  }

  showExpansion() {
    if (!dragController.isDragging) {
      this.container.style.display = 'inline-block'
      setTimeout(() => {
        this.container.style.opacity = '1'
      }, 1)
    }
  }

  hideExpansion() {
    this.container.style.opacity = '0'
    setTimeout(() => {
      this.container.style.display = 'none'
    }, 150)
  }

  render() {
    return (
      <div className="HoverPopup" ref={el => this.container = el}>
        
      </div>
    )
  }
}