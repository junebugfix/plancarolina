import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { scheduleStore } from './ScheduleStore';
import { uiStore } from './UIStore';
import { loginStore } from './LoginStore';
import { CourseData } from './components/Course';
import App from './components/App';
import { createDiffieHellman } from 'crypto';

declare global {
  // let googleyolo: any
  interface Window {
    onGoogleYoloLoad: any
  }
}

window.onGoogleYoloLoad = googleyolo => {
  loginStore.handleGoogleYoloLoaded(googleyolo)
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)