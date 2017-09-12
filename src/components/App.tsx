import * as React from 'react'
import '../styles/App.css'
import { store } from '../Store'
import Toolbar from './Toolbar'
import Header from './Header'
import Schedule from './Schedule'

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Toolbar />
        <Header />
        <Schedule />
      </div>
    )
  }
}