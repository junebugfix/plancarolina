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

  constructor(props: { data: CourseData }) {
    super(props)
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

  render() {
    if (uiStore.expandedView) {
      const data = this.props.data
      let style = {
        height: 44,
        textAlign: 'left',
        paddingTop: 2,
        paddingLeft: 5,
        paddingBottom: 3,
        fontSize: 12
      }
      let dotStyle = {
        backgroundColor: `hsl(${colorController.getScheduleHue(data.department)}, 80%, 80%)`
      }
      return (
        <div className="Course" id={`course-${data.id}`} style={style}>
          <span className="course-dot" style={dotStyle}></span>
          <span className="course-label" style={{fontWeight: uiStore.expandedView ? 500 : 400}}>{data.department} {data.number}{data.modifier}</span>
          {uiStore.expandedView && <span className="credits">({data.credits})</span>}
          {uiStore.expandedView && <div className="course-geneds">{data.geneds.map(ge => <span className="gened-block" key={`geb-${this.counter++}`}>{ge}</span>)}</div>}
          {uiStore.expandedView && <div ref={el => this.nameEl = el} className="course-name" style={{display: uiStore.expandedView ? '' : 'none'}}>{data.name}</div>}
          <span className="Course-x" style={{marginTop: uiStore.expandedView ? 10 : '', right: uiStore.expandedView ? 3 : ''}} onClick={uiStore.handleRemoveCourse}>x</span>
          {uiStore.expandedView && <span ref={el => this.setElipsesEl(el)} className="elipses" style={{display: uiStore.expandedView ? '' : 'none'}}></span>}
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
    } else {
      const data = this.props.data
      const hue = colorController.getScheduleHue(data.department)
      const courseColor = `hsl(${hue}, 80%, 80%)`
      const dotStyle = {
        backgroundColor: courseColor
      }
      const courseStyle = {
        backgroundColor: uiStore.isMobileView ? courseColor : ''
      }
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
  }
}