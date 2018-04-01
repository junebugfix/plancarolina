import * as React from 'react';
import Toolbar from './Toolbar';
import SearchBar from './SearchBar';
import MobileSearchBar from './MobileSearchBar';
import '../styles/App.css';
import Schedule from './Schedule';
import LoginPopup from './LoginPopup';
import Validators from './Validators';
import Footer from './Footer';
import Settings from './Settings';
import Spinner from './Spinner';
import HandleConflictPopup from './HandleConflictPopup';
import { observer } from 'mobx-react';
import { uiStore } from '../UIStore';
import { loginStore } from '../LoginStore';
import Snackbar from 'material-ui/Snackbar';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button'
import { AlertPopup } from './AlertPopup'

@observer
export default class App extends React.Component {

  componentDidMount() {
    loginStore.tryAutoLogin()
  }

  render() {
    return (
      <div className="App">
        <div className="content-container">
          <div className="content-left">
            <h1 className="main-title">Plan Carolina</h1>
            <div className="search-bar-container">
              {uiStore.isMobileView ? <MobileSearchBar /> : <SearchBar />}
               {/* <SearchBar /> */}
            </div>
          </div>
          <div className="content-right">
            <Toolbar />
            <div className="schedule-container">
              <Schedule />
            </div>
            <div className="validators-settings-container">
              <div className="validators-settings">
                <Validators />
                <Settings />
                <div className="validators box-shadow"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-container">
          <Footer />
        </div>
        <Snackbar
          open={uiStore.alertOpen}
          onRequestClose={() => uiStore.alertOpen = false}
          message={<span>{uiStore.alertMessage}</span>}
          autoHideDuration={3000}
        />
        <Snackbar
          open={uiStore.persistentLoginAlertActive}
          message={<span>You are not logged in - your schedule is not being saved!</span>}
          className="persistent-snackbar"
          action={<Button color="accent" dense onClick={() => uiStore.loginPopupActive = true}>Login</Button>}
          style={{marginRight: 20, marginBottom: 50}}
        />
        {uiStore.loginAlertActive && <AlertPopup 
          title="Hey there"
          body="We notice that you haven't logged in yet, make sure to do that if you would like to save your schedule! (We save it automatically, just log in and let us do the work)"
          onClose={() => {uiStore.loginAlertActive = false; uiStore.shouldPromptForLogin = false; uiStore.persistentLoginAlertActive = true}}
        />}
        {uiStore.addMajorAlertActive && <AlertPopup 
          title="About adding majors"
          body="As you can imagine, PlanCarolina has a lot of majors. The way that we support majors is we fill in the courses that you have to take for your major, and then direct you to your academic worksheet. We do this because many majors require courses that: are above a certain number, must be chosen from a group of courses, etc. Therefore, the classes that autofill may not be all of the classes that are required for your major. This feature will come in the future though!"
          onClose={() => {uiStore.addMajorAlertActive = false; uiStore.shouldPromptAddMajor = false; }}
        />}
        {uiStore.promptHandleConflictPopup && <HandleConflictPopup />}
      </div>
    )
  }
}