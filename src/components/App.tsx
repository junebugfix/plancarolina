import * as React from 'react'
import '../styles/App.css'
import Toolbar from './Toolbar'
import SearchBar from './SearchBar'
import Schedule from './Schedule'
import LoginPopup from './LoginPopup'
import Validators from './Validators'
import Footer from './Footer'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'

@observer
export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Toolbar />
        <div className="content">
          <div className="search-bar-container">
            <SearchBar />
          </div>
          <div className="schedule-validators-container">
            <div className="schedule-container">
              <Schedule />
            </div>
            <div className="validators-container">
              <Validators />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}