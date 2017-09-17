import * as React from 'react'
import '../styles/App.css'
import Toolbar from './Toolbar'
import SearchBar from './SearchBar'
import Schedule from './Schedule'
import { uiStore } from '../UIStore'

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Toolbar />
        <SearchBar />
        <Schedule />
      </div>
    )
  }
}