import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import { loginStore } from '../LoginStore'
import AddMajorPopup from './AddMajorPopup'
import YearEnteredPrompt from './YearEnteredPrompt'
import LoginPopup from './LoginPopup'
import SearchResults from './SearchResults'
import { MajorWorksheetLink } from './MajorWorksheetLink'
import '../styles/Toolbar.css'

const logo = require('../logo.png')

@observer
export default class Toolbar extends React.Component {
  render() {
    return (
      <div className="Toolbar">
        {/* <img className="Toolbar-logo" src={logo} /> */}
        {/* <div className="Toolbar-item">
          <h1 className="Toolbar-text">Plan Carolina</h1>
        </div> */}
        <div className="toolbar-content">
          <div className="Toolbar-item" id="amp" onClick={uiStore.handleAddMajorClicked}>
            <span className="Toolbar-text hoverable">Add Major</span>
            {uiStore.addMajorPopupActive && <AddMajorPopup />}
            {uiStore.addMajorPopupActive && <SearchResults label={uiStore.MAJOR_LABEL} items={uiStore.majorResults} />}
            {uiStore.yearEnteredPromptActive && <YearEnteredPrompt />}
          </div>
          <div className="Toolbar-item" onClick={uiStore.handleLoginPopupClicked}>
            <span className="Toolbar-text hoverable">{loginStore.isLoggedIn && loginStore.name || 'Login'}</span>
            {uiStore.loginPopupActive && <LoginPopup />}
          </div>
        </div>
      </div>
    )
  }
}