import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { autorun } from 'mobx'
import { scheduleStore } from './ScheduleStore'
import { CourseData } from './components/Course'
// import './fonts/fonts.css'
import App from './components/App'

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)
