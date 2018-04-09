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
  number: number,
  modifier: string,
  name: string,
  credits: number,
  geneds: string[],
  description: string,
}

@observer
export default class Course extends React.Component<{ data: CourseData }, {}> {
  counter = 0
  hasMounted = false
  nameEl: HTMLElement
  elipsesEl: HTMLElement

  componentWillMount() {
    if (this.props.data.geneds[0] === '') {
      this.props.data.geneds = []
    }
  }

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
    return `hsl(${colorController.getScheduleHue(this.props.data.department)}, 80%, 80%)`
  }

  renderSmallCourse() {
    const data = this.props.data
    const color = this.getColor()
    const dotStyle = { backgroundColor: color }
    // const courseStyle = { backgroundColor: uiStore.isMobileView ? color : '' }
    const courseStyle = {}
    return (
      <div className="Course" id={`course-${data.id}`} style={courseStyle}>
        <span className="course-dot" style={dotStyle}></span>
        <span className="course-label">{data.department}&nbsp;{data.number}{data.modifier}</span>
        <span className="Course-x" onClick={uiStore.handleRemoveCourse}>x</span>
        <div className="course-info-popup">
          <span className="department">{data.department}</span>
          <span className="number"> {data.number}</span>
          <div className="name">{data.name}</div>
          <p className="description">{data.description}</p>
          <div className="credits">Credits: {data.credits}</div>
          {data.geneds.length > 0 && <div className="geneds">Gen Eds: {data.geneds.map(ge => <span className="gened-block" key={`pge-${this.counter++}`}>{ge}</span>)}</div>}
        </div>
      </div>
    )
  }

  renderExpandedCourse() {
    const data = this.props.data
    const color = this.getColor()
    const dotStyle = { backgroundColor: color }
    return (
      <div className="Course expanded" id={`course-${data.id}`}>
        <span className="course-dot" style={dotStyle}></span>
        <span className="course-label">{data.department} {data.number}{data.modifier}</span>
        <span className="credits">({data.credits})</span>
        <div className="course-geneds">{data.geneds.map(ge => <span className="gened-block" key={`geb-${this.counter++}`}>{ge}</span>)}</div>
        <div ref={el => this.nameEl = el} className="course-name">{data.name}</div>
        <span className="Course-x" onClick={uiStore.handleRemoveCourse}>x</span>
        <span ref={el => this.setElipsesEl(el)} className="elipses"></span>
        <div className="course-info-popup">
          <span className="department">{data.department}</span>
          <span className="number"> {data.number}</span>
          <div className="name">{data.name}</div>
          <p className="description">{data.description}</p>
          <div className="credits">Credits: {data.credits}</div>
          {data.geneds.length > 0 && <div className="geneds">Gen Eds: {data.geneds.map(ge => <span className="gened-block" key={`pge-${this.counter++}`}>{ge}</span>)}</div>}
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