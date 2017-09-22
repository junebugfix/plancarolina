import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import '../styles/LoginPopup.css'

@observer
export default class LoginPopup extends React.Component {

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect().then(() => {
      location.reload()
      console.log("User signed out.")
    })
  }
  
  render() {
    let display = uiStore.loginPopupActive ? {display: 'flex'} : {display: 'none'};
    return (
      <div className="LoginPopup" style={display}>
        <div className="g-signin2" data-onsuccess={onSignIn}></div>
        <button className="google-signout" onClick={this.signOut}>Sign out</button>
      </div>
    )
  }
}

export function syncCurrentUserInformation() {
  let auth2 = gapi.auth2.getAuthInstance();
  let profile = auth2.currentUser.get().getBasicProfile();
  if (profile === undefined) {
    console.log("No user is logged in, syncing cancelled");
    return; 
  }

  console.log(profile.getName());
  console.log(profile.getImageUrl());
  console.log(profile.getEmail());
}

export function onSignIn(googleUser: any) {
  console.log("HEY LISTEN THE ON SIGN IN THING GOT CALLED WHICH IS COOL");
  var profile = googleUser.getBasicProfile();

  if (profile === undefined) {
    console.log("No user is logged in, syncing cancelled");
    return; 
  }
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}