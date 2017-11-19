import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import { loginStore } from '../LoginStore'
import GoogleLogin from 'react-google-login'
import '../styles/LoginPopup.css'

@observer
export default class LoginPopup extends React.Component {

  signOut() {
    // var auth2 = gapi.auth2.getAuthInstance();
    // auth2.disconnect().then(() => {
    //   location.reload()
    //   console.log("User signed out.")
    // })
  }

  render() {
    return (
      <div className="LoginPopup">
        {loginStore.isLoggedIn && 
          <button className="google-signout" onClick={loginStore.logout}>
            Sign out
          </button> ||
          <GoogleLogin
            clientId="724319730394-0p2g3j67ju1l310deto92mvqv3hasshn.apps.googleusercontent.com"
            buttonText="Sign in"
            onSuccess={loginStore.handleGoogleLoginSuccess}
            onFailure={loginStore.handleLoginFailure}
            style={{}}
          />
        }
      </div>
    )
  }
}
