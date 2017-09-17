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
    const Slip = require('../slip.js')
    let slipList = new Slip(this.divEl)
    this.divEl.addEventListener('slip:reorder', (e: any) => {
      if (this.isReorderWithinList(e)) {
        scheduleStore.reorderInList(e.target, e.detail.originalIndex, e.detail.spliceIndex)
      } else { // course was dragged to a different list
        const toList = e.target
        const fromList = e.detail.origin.container
        const toIndex = e.detail.spliceIndex
        const fromIndex = e.detail.originalIndex
        scheduleStore.changeLists(fromList, fromIndex, toList, toIndex)
      }
    })
    scheduleStore.connectSlipList(slipList)
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