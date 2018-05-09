import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import { colorController } from '../ColorController'
import { Departments } from '../departments'
import '../styles/Course.css'
import { dragController } from '../DragController';

export type CourseData = {
  id: number,
  department: string,
  courseNumber: number,
  modifier: string,
  name: string,
  credits: number,
  geneds: string[],
  description: string,
}

interface CourseProps {
  id: number
  department: string
  courseNumber: number
  modifier: string
  name: string
  credits: number
  geneds: string[]
  description: string
  semesterIndex: number
  courseIndex: number
}

@observer
export default class Course extends React.Component<CourseProps, {}> {
  counter = 0
  hasMounted = false
  elipsesEl: HTMLElement
  container: HTMLElement
  moreTag: HTMLElement

  activateMoreTag() {
    this.moreTag.classList.add('active')
  }

  deactivateMoreTag() {
    this.moreTag.classList.remove('active')
    this.hideExpansion()
  }

  shouldAlignPopupLeft() {
    return [0, 1, 5, 6, 10, 11].includes(this.props.semesterIndex)
  }

  showExpansion() {
    if (!dragController.isDragging) {
      this.container.classList.add('described')
      const bounds = this.container.getBoundingClientRect()
      const left = this.shouldAlignPopupLeft() ? bounds.left : bounds.right - 250
      if (this.props.semesterIndex > 4) {
        uiStore.showCoursePopup(this.props, left + window.scrollX, undefined, bounds.top + window.scrollY)
      } else {
        uiStore.showCoursePopup(this.props, left + window.scrollX, bounds.bottom + window.scrollY)
      }
    }
  }

  hideExpansion() {
    uiStore.hideCoursePopup()
    this.container.classList.remove('described')
  }

  getColor() {
    return `hsl(${colorController.getScheduleHue(this.props.department)}, 80%, 80%)`
  }

  renderSmallCourse() {
    const { department, courseNumber, modifier, id, courseIndex, semesterIndex } = this.props
    const color = this.getColor()
    const dotStyle = { backgroundColor: color }
    const style = { height: uiStore.courseHeight }
    return (
      <div
        className="Course"
        id={`course-${id}`}
        style={style}
        ref={el => this.container = el}
        onMouseOver={() => {
          if (!dragController.isDragging) {
            this.activateMoreTag()
          }
        }}
        onMouseLeave={() => this.deactivateMoreTag()}
        onMouseDown={() => this.deactivateMoreTag()}
      >
        <span className="course-dot" style={dotStyle}></span>
        <span className="course-label">{department}&nbsp;{courseNumber}{modifier}</span>
        <span className="more" onMouseOver={() => this.showExpansion()} onMouseOut={() => this.hideExpansion()} ref={el => this.moreTag = el}>...</span>
        <span className="Course-x" onClick={() => scheduleStore.removeCourseFromSemester(courseIndex, semesterIndex)}><img src="x.svg" alt="delete" /></span>
      </div>
    )
  }

  renderExpandedCourse() {
    const { department, courseNumber, credits, name, geneds, modifier, id, courseIndex, semesterIndex } = this.props
    const color = this.getColor()
    const dotStyle = { backgroundColor: color }
    const style = { height: uiStore.courseHeight }
    return (
      <div
        className="Course expanded"
        id={`course-${id}`}
        style={style}
        ref={el => this.container = el}
        onMouseOver={() => {
          if (!dragController.isDragging) {
            this.activateMoreTag()
          }
        }}
        onMouseLeave={() => this.deactivateMoreTag()}
        onMouseDown={() => this.deactivateMoreTag()}
      >
        <span className="course-dot" style={dotStyle}></span>
        {/* <span className="credits">{credits}</span> */}
        <span className="course-label">{department} {courseNumber}{modifier}</span>
        <div className="course-geneds">{geneds.filter(x => x !== '').map(ge => <span className="gened-block" key={`geb-${this.counter++}`}>{ge.substr(0, 2)}</span>)}</div>
        <span className="more" onMouseOver={() => this.showExpansion()} onMouseOut={() => this.hideExpansion()} ref={el => this.moreTag = el}>...</span>
        <span className="Course-x" onClick={() => scheduleStore.removeCourseFromSemester(courseIndex, semesterIndex)}><img src="x.svg" alt="delete" /></span>
      </div>
    )
  }

  render() {
    if (uiStore.expandedView) {
      return this.renderExpandedCourse()
    }
    return this.renderSmallCourse()
  }
}