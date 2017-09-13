import * as React from 'react'
import { observer } from 'mobx-react'
import Semester from './Semester'
import { Semesters } from '../utils'
import { CourseData } from './Course'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import SummerButton from './SummerButton'
import '../styles/Schedule.css'

interface ScheduleState {
  semesters: CourseData[][]
}

@observer
export default class Schedule extends React.Component {

  render() {
    return (
      // <div className="Schedule">{semesterDivs}</div>
      <div className="Schedule">
        <div className="Schedule-row">
          <Semester index={Semesters.Fall1} />
          <Semester index={Semesters.Fall2} />
          <Semester index={Semesters.Fall3} />
          <Semester index={Semesters.Fall4} />
          {uiStore.fall5Active &&
          <Semester index={Semesters.Fall5} />}
        </div>
        <div className="Schedule-row">
          <Semester index={Semesters.Spring1} />
          <Semester index={Semesters.Spring2} />
          <Semester index={Semesters.Spring3} />
          <Semester index={Semesters.Spring4} />
          {uiStore.spring5Active &&
          <Semester index={Semesters.Spring5} />}
        </div>
      </div>
    )
  }
}