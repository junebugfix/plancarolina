import * as React from 'react'
import { store } from '../Store'
import '../styles/Toolbar.css'

const logo = require('../logo.png')

export default class Toolbar extends React.Component {
  render() {
    return (
      <div className="Toolbar">
        <div className="Toolbar-item">
          <img className="Toolbar-logo" src={logo} />
        </div>
        <div className="Toolbar-item" onClick={store.addClass}>Add Class</div>
        <div className="Toolbar-item" onClick={store.addMajor}>Add Major</div>
      </div>
    )
  }
}
