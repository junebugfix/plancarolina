import * as React from 'react'
import { observable } from 'mobx'
import * as Cookies from 'js-cookie'
import { uiStore } from '../UIStore'
import { loginStore } from '../LoginStore'
import "../styles/AlertPopup.css"

export class AlertPopup extends React.Component<{title: string, body: string, onClose: Function}, {}> {

  render() {
    return (
      <div>
        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>{this.props.title}</h2>
            <a className="close" href="#" onClick={this.props.onClose as any}>&times;</a>
            <br></br>
            <div className="content">
              {this.props.body}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
