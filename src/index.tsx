import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { scheduleStore } from './ScheduleStore';
import { uiStore } from './UIStore';
import { CourseData } from './components/Course';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker'

declare global {
  let gapi: any
  interface Window {
    uiStore: any
  }
}
window.uiStore = uiStore

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()