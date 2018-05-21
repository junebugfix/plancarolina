import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import { colorController } from '../ColorController'
import { Departments } from '../departments'
import '../styles/Course.css'
import { dragController } from '../DragController'
import { isBottomSemester } from '../utils'

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

interface Props {
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
export default class Course extends React.Component<Props, {}> {
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
      if (isBottomSemester(this.props.semesterIndex)) {
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

  handleMoreMouseleave(e: React.MouseEvent<HTMLSpanElement | HTMLDivElement>) {
    const { toElement } = e.nativeEvent
    if (toElement && !toElement.classList.contains('course-popup')) {
      this.deactivateMoreTag()
    }
  }

  getColor() {
    return `hsl(${colorController.getScheduleHue(this.props.department)}, 80%, 80%)`
  }

  render() {
    const { department, courseNumber, modifier, id, geneds, courseIndex, semesterIndex } = this.props
    const color = this.getColor()
    const dotStyle = { backgroundColor: color }
    const style = { height: uiStore.courseHeight }
    const classes = ['Course']
    if (uiStore.expandedView) classes.push('expanded')
    if (uiStore.isMobileView) classes.push('mobile')
    return (
      <div
        className={classes.join(' ')}
        id={`course-${id}`}
        style={style}
        ref={el => this.container = el}
        onMouseOver={() => {
          if (!dragController.isDragging) {
            this.activateMoreTag()
          }
        }}
        onMouseLeave={e => this.handleMoreMouseleave(e)}
        onMouseDown={() => this.deactivateMoreTag()}
      >
        <span className="course-dot" style={dotStyle}></span>
        <span className="course-label">{department}&nbsp;{courseNumber}{modifier}</span>
        {uiStore.expandedView && <div className="course-geneds">{geneds.filter(x => x !== '').map(ge => <span className="gened-block" key={`geb-${this.counter++}`}>{ge.substr(0, 2)}</span>)}</div>}
        <span className="more" onMouseOver={() => this.showExpansion()} onMouseLeave={e => this.handleMoreMouseleave(e)} ref={el => this.moreTag = el}>...</span>
        <span className="Course-x" onClick={() => scheduleStore.removeCourseFromSemester(courseIndex, semesterIndex)}><img src="x.svg" alt="delete" /></span>
      </div>
    )
  }
}