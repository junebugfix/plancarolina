import * as React from 'react'
import { observer } from 'mobx-react'
import '../styles/Header.css'

@observer
export default class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <h1 className="Header-title">Plan Carolina</h1>
      </div>
    )
  }
}