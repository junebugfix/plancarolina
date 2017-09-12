import * as React from 'react'
import { store } from '../Store'
import Semester, { Semesters } from './Semester'
import { CourseData } from './Course'
import SummerButton from './SummerButton'
import '../styles/Schedule.css'

interface ScheduleState {
  semesters: CourseData[][]
}

export default class Schedule extends React.Component<{}, {semesters: CourseData[][]}> {

  constructor() {
    super()
    store.registerSchedule(this);
    this.state = {
      semesters: store.userData.semesters
    }
  }

  render() {
    const semesters = this.state.semesters
    return (
      // <div className="Schedule">{semesterDivs}</div>
      <div className="Schedule">
        <div className="Schedule-row">
          <Semester index={Semesters.Fall1} data={semesters[Semesters.Fall1]} />
          <Semester index={Semesters.Fall2} data={semesters[Semesters.Fall2]} />
          <Semester index={Semesters.Fall3} data={semesters[Semesters.Fall3]} />
          <Semester index={Semesters.Fall4} data={semesters[Semesters.Fall4]} />
          {store.userData.fall5active &&
          <Semester index={Semesters.Fall5} data={semesters[Semesters.Fall5]} />}
        </div>
        <div className="Schedule-row">
          <Semester index={Semesters.Spring1} data={semesters[Semesters.Spring1]} />
          <Semester index={Semesters.Spring2} data={semesters[Semesters.Spring2]} />
          <Semester index={Semesters.Spring3} data={semesters[Semesters.Spring3]} />
          <Semester index={Semesters.Spring4} data={semesters[Semesters.Spring4]} />
          {store.userData.spring5active &&
          <Semester index={Semesters.Spring5} data={semesters[Semesters.Spring5]} />}
        </div>
      </div>
    )
  }
}