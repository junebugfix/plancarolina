import * as React from 'react';
import Toolbar from './Toolbar';
import SearchBar from './SearchBar';
import '../styles/App.css';
import Schedule from './Schedule';
import LoginPopup from './LoginPopup';
import Validators from './Validators';
import Footer from './Footer';
import Settings from './Settings';
import { observer } from 'mobx-react';
import { uiStore } from '../UIStore';
import Snackbar from 'material-ui/Snackbar';

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
            <div className="validators-settings-container">
              <div className="validators-container">
                <Validators />
              </div>
              <div className="settings-container">
                <Settings />
              </div>
            </div>
          </div>
        </div>
        <Snackbar
          open={uiStore.alertOpen}
          onRequestClose={() => uiStore.alertOpen = false}
          message={<span>{uiStore.alertMessage}</span>}
          autoHideDuration={3000}
        />
        <Footer />
      </div>
    )
  }
}