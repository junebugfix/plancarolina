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
        <div className="toolbar-content">
          <div className="Toolbar-item" onClick={uiStore.handleLoginPopupClicked}>
            <span className="Toolbar-text hoverable">{loginStore.isLoggedIn && loginStore.name || 'Login'}</span>
            {uiStore.loginPopupActive && <LoginPopup />}
          </div>
        </div>
      </div>
    )
  }
}