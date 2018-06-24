import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { scheduleStore } from './ScheduleStore'
import { uiStore } from './UIStore'
import { loginStore } from './LoginStore'
import { CourseData } from './components/Course'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import polyfillEventTarget from 'eventlistener-polyfill'
import './array-includes-polyfill'

polyfillEventTarget(document)

declare global {
  let gapi: any
  interface Window {
    onGoogleYoloLoad: any
  }

  interface Array<T> {
    includes: (x: T) => boolean
  }
}

window.onGoogleYoloLoad = googleyolo => {
  loginStore.handleGoogleYoloLoaded(googleyolo)
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()