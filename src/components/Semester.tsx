import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import SearchBarResult from './SearchBarResult'
import { Departments } from '../departments'
import { Semesters } from '../utils'
import { uiStore } from '../UIStore'
import { CourseData } from './Course'
import { dragController } from '../DragController';
import '../styles/Semester.css'

@observer
export default class Semester extends React.Component<{ index: Semesters, type: 'normal' | 'mobile', courses: CourseData[] }, {}> {
  container: HTMLDivElement
  ghostEl: HTMLDivElement
  label: string

  constructor(props: { index: Semesters, type: 'normal' | 'mobile', courses: CourseData[] }) {
    super(props)
    this.label = uiStore.getSemesterLabel(props.index)
  }

  componentDidMount() {
    dragController.registerDraggableList(this.container)
  }

  render() {
    const style = { height: uiStore.semesterHeight }
    const classes = this.props.type === 'mobile' ? 'Semester mobile' : 'Semester'
    return (
      <div className={classes}>
        <div className="Semester-label">{this.label}</div>
        <div ref={el => this.container = el as HTMLDivElement} style={style} className="Semester-courses" id={`${Semesters[this.props.index]}`}>
          {this.props.courses.map(data => <Course key={`${data.id}-c`} {...data} />)}
        </div>
        <button className="Semester-add-button">+</button>
        <div className="Semester-add-background"></div>
      </div>
    )
  }
}
