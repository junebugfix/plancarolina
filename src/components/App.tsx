import * as React from 'react'
import '../styles/App.css'
import Toolbar from './Toolbar'
import SearchBar from './SearchBar'
import Schedule from './Schedule'
import LoginPopup from './LoginPopup'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'

@observer
export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Toolbar />
        <SearchBar />
        {uiStore.loginPopupActive && <LoginPopup />}
        <Schedule />
      </div>
    )
  }
}