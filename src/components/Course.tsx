import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import { colorController } from '../ColorController'
import { Departments } from '../departments'
import '../styles/Course.css'

export type CourseData = {
  id: number,
  department: string,
  courseNumber: number,
  modifier: string,
  name: string,
  credits: number,
  geneds: string[],
  description: string,
};

@observer
export default class Course extends React.Component<CourseData, {}> {
  counter = 0
  hasMounted = false
  nameEl: HTMLElement
  elipsesEl: HTMLElement

  isOverflowing() {
    return this.nameEl.clientHeight > 24
  }
  
  setElipsesEl(el: HTMLElement) {
    this.elipsesEl = el
    if (uiStore.expandedView) {
      this.checkAndAddElipses()
    }
  }

  checkAndAddElipses() {
    if (this.isOverflowing()) {
      this.elipsesEl.innerHTML = '...'
    }
  }

  getColor() {
    return `hsl(${colorController.getScheduleHue(this.props.department)}, 80%, 80%)`
  }

  renderSmallCourse() {
    const { department, courseNumber, name, description, credits, geneds, modifier, id } = this.props
    const color = this.getColor()
    const dotStyle = { backgroundColor: color }
    return (
      <div className="Course" id={`course-${id}`}>
        <span className="course-dot" style={dotStyle}></span>
        <span className="course-label">{department}&nbsp;{courseNumber}{modifier}</span>
        <span className="Course-x" onClick={uiStore.handleRemoveCourse}>x</span>
        <div className="course-info-popup">
          <span className="department">{department}</span>
          <span className="number"> {courseNumber}</span>
          <div className="name">{name}</div>
          <p className="description">{description}</p>
          <div className="credits">Credits: {credits}</div>
          {geneds.length > 0 && <div className="geneds">Gen Eds: {geneds.map(ge => <span className="gened-block" key={`pge-${this.counter++}`}>{ge}</span>)}</div>}
        </div>
      </div>
    )
  }

  renderExpandedCourse() {
    const { department, courseNumber, name, description, credits, geneds, modifier, id } = this.props
    const color = this.getColor()
    const dotStyle = { backgroundColor: color }
    return (
      <div className="Course expanded" id={`course-${id}`}>
        <span className="course-dot" style={dotStyle}></span>
        <span className="course-label">{department} {courseNumber}{modifier}</span>
        <span className="credits">({credits})</span>
        <div className="course-geneds">{geneds.map(ge => <span className="gened-block" key={`geb-${this.counter++}`}>{ge}</span>)}</div>
        <div ref={el => this.nameEl = el} className="course-name">{name}</div>
        <span className="Course-x" onClick={uiStore.handleRemoveCourse}>x</span>
        <span ref={el => this.setElipsesEl(el)} className="elipses"></span>
        <div className="course-info-popup">
          <span className="department">{department}</span>
          <span className="number"> {courseNumber}</span>
          <div className="name">{name}</div>
          <p className="description">{description}</p>
          <div className="credits">Credits: {credits}</div>
          {geneds.length > 0 && <div className="geneds">Gen Eds: {geneds.map(ge => <span className="gened-block" key={`pge-${this.counter++}`}>{ge}</span>)}</div>}
        </div>
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