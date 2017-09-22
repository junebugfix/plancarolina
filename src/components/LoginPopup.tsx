import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import '../styles/LoginPopup.css'
import '../scripts/platform.js'

@observer
export default class AddMajorPopup extends React.Component {
  render() {
    let display = uiStore.loginPopupActive ? {display: 'flex'} : {display: 'none'};
    return (
      <div className="LoginPopup" style={display}>
        <div className="g-signin2" data-onsuccess="onSignIn"></div>
        <a href="#" onClick={this.signOut}>Sign out of Google</a>
      </div>
    )
  }

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log("User signed out.")
    })
  }
}