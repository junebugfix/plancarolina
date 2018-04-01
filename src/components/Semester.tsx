import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import SearchBarResult from './SearchBarResult'
import { Departments } from '../departments'
import { Semesters } from '../utils'
import { uiStore } from '../UIStore'
import { CourseData } from './Course'
import '../styles/Semester.css'

@observer
export default class Semester extends React.Component<{ index: Semesters, type: 'normal' | 'mobile' }, {}> {
  divEl: HTMLDivElement; // store the div element of the semester with a 'ref' attribute (see render below) to pass it to slipjs
  label: string
  isRegistered: boolean

  constructor(props: { index: Semesters, type: 'normal' | 'mobile' }) {
    super(props)
    this.label = uiStore.getSemesterLabel(props.index)
    this.isRegistered = false
  }

  isReorderWithinList(e: Event): boolean {
    return (e.target as HTMLDivElement).classList.contains('Course')
  }

  componentDidUpdate() {
    if (!this.isRegistered) {
      if (this.props.type === 'normal') {
        console.log('registering')
        uiStore.registerSlipList(this.divEl)
        this.isRegistered = true
      }
    } else if (this.props.type === 'mobile') {
      this.isRegistered = false
    }
  }

  render() {
    const semesterData = scheduleStore.getSemesterData(this.props.index)
    const style = {
      height: uiStore.semesterHeight
    }
    const classes = this.props.type === 'mobile' ? 'Semester mobile' : 'Semester'

    return (
      <div className={classes}>
        <div className="Semester-label">{this.label}</div>
        <div ref={el => this.divEl = el as HTMLDivElement} style={style} className="Semester-courses" id={`${Semesters[this.props.index]}`}>
          {semesterData.map(data => <Course key={`course-${data.id}`} data={data} />)}
        </div>
        <button className="Semester-add-button">+</button>
        <div className="Semester-add-background"></div>
        <div className="schedule box-shadow"></div>
      </div>
    )
  }
}
