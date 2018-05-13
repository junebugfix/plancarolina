import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import SearchBarResult from './SearchBarResult'
import QuickAddInput from './QuickAddInput'
import { Departments } from '../departments'
import { Semesters } from '../utils'
import { uiStore } from '../UIStore'
import { CourseData } from './Course'
import { dragController } from '../DragController';
import CourseSearch from '../CourseSearch';
import '../styles/Semester.css'
import { coursesStore } from '../CoursesStore';

@observer
export default class Semester extends React.Component<{ label: string, index: Semesters, type: 'normal' | 'mobile', courses: CourseData[] }, { quickAddActive: boolean }> {
  container: HTMLDivElement
  addBackground: HTMLDivElement
  addButton: HTMLButtonElement
  counter = 0
  @observable tooltipOpen = false
  @observable searchResults: CourseData[] = []
  @observable isLoadingCourses = false

  constructor(props: { label: string, index: Semesters, type: 'normal' | 'mobile', courses: CourseData[] }) {
    super(props)
    this.state = { quickAddActive: false }
  }

  componentDidMount() {
    dragController.registerDraggableList(this.container)
  }

  handleAddClicked(e: React.MouseEvent<HTMLButtonElement>) {
    this.addBackground.style.display = 'none'
    this.addButton.style.display = 'none'
    this.setState({ quickAddActive: true })
  }

  handleXClicked() {
    if (this.tooltipOpen || this.props.courses.length === 0) {
      uiStore.removeSummer(this.props.index)
      this.tooltipOpen = false
    } else {
      this.tooltipOpen = true
    }
  }

  @action.bound handleCourseAdded(course: CourseData) {
    scheduleStore.getSemester(this.props.index).push(course)
    scheduleStore.saveSchedule()
  }

  render() {
    const { type, label } = this.props
    const style = { height: uiStore.semesterHeight }
    let classes = ['Semester']
    if (type === 'mobile') classes.push('mobile')
    if (label === 'Summer') {
      classes.push('summer')
      style.height = uiStore.summerHeight
    }
    return (
      <div className={classes.join(' ')}>
        <div className="Semester-label" onMouseLeave={() => this.tooltipOpen = false}>
          {label}
          {label === 'Summer' && <span className="Summer-x" onClick={() => this.handleXClicked()}><img src="x.svg" alt="Remove summer" /></span>}
          {this.tooltipOpen && <div className="confirm-delete-popup">Delete summer and its courses?</div>}
        </div>
        <div ref={el => this.container = el as HTMLDivElement} style={style} className="Semester-courses" id={`${Semesters[this.props.index]}`}>
          {this.props.courses.map((data, index) => <Course key={`${data.id}-c`} courseIndex={index} semesterIndex={this.props.index} {...data} />)}
          {this.state.quickAddActive &&
            <QuickAddInput semesterIndex={this.props.index} onAdd={course => this.handleCourseAdded(course)} onBlur={e => {this.setState({ quickAddActive: false })}} />
          }
        </div>
        <button ref={el => this.addButton = el} onClick={() => this.setState({ quickAddActive: true })} className="Semester-add-button">+</button>
        <div ref={el => this.addBackground = el} className="Semester-add-background"></div>
      </div>
    )
  }
}
