import * as React from 'react'
import { uiStore } from '../UIStore'
import "../styles/AlertPopup.css"

export class AlertPopup extends React.Component<{title: string, body: string}, {}> {
  render() {
    return (
      <div>
        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>{this.props.title}</h2>
            <a className="close" href="#" onClick={uiStore.handleClosePopup}>&times;</a>
            <div className="content">
              {this.props.body}
            </div>
          </div>
        </div>
      </div>
    )
  }
}