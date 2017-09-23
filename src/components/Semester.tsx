import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import { Departments } from '../departments'
import { Semesters } from '../utils'
import { uiStore } from '../UIStore'
import { CourseData } from './Course'
import '../styles/Semester.css'

@observer
export default class Semester extends React.Component<{ index: Semesters }, {}> {
  divEl: HTMLDivElement; // store the div element of the semester with a 'ref' attribute (see render below) to pass it to slipjs
  label: string

  constructor(props: { index: Semesters }) {
    super(props)
    this.label = uiStore.getSemesterLabel(props.index)
  }

  isReorderWithinList(e: Event): boolean {
    return (e.target as HTMLDivElement).classList.contains('Course')
  }

  componentDidMount() {
    uiStore.registerSlipList(this.divEl)
  }

  render() {
    const semesterData = scheduleStore.getSemesterData(this.props.index)
    return (
      <div className="Semester">
        <div className="Semster-label">{this.label}</div>
        <div ref={input => this.divEl = input as HTMLDivElement} className="Semester-courses" id={`${Semesters[this.props.index]}`}>
          {semesterData.map(data => <Course key={`course-${data.id}`} data={data} />)}
        </div>
      </div>
    )
  }

}