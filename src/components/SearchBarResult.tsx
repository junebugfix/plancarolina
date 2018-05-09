import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import { colorController } from '../ColorController'
import Course, { CourseData } from './Course'
import '../styles/SearchBarResults.css'
import { dragController } from '../DragController';

interface SearchBarResultData {
  department: string
  courseNumber: number 
  modifier: string
  name: string
  id: number
}

@observer
export default class SearchBarResult extends React.Component<{ data: CourseData, index: number }, {}> {
  nameEl: HTMLSpanElement
  elipsesEl: HTMLSpanElement
  moreTag: HTMLElement
  container: HTMLElement
  counter = 0

  componentDidMount() {
    document.addEventListener('resize', () => this.ensureAlignment())
    this.ensureAlignment()
  }

  isOverflowing() {
    return Math.abs(this.nameEl.clientWidth - this.nameEl.scrollWidth) > 2 || Math.abs(this.nameEl.clientHeight - this.nameEl.scrollHeight) > 2
  }

  ensureAlignment() {
    if (this.isOverflowing()) {
      this.nameEl.style.alignItems = 'flex-start'
    } else {
      this.nameEl.style.alignItems = 'center'
    }
  }

  componentDidUpdate() {
    this.ensureAlignment()
  }

  activateMoreTag() {
    this.moreTag.classList.add('active')
  }

  deactivateMoreTag() {
    this.moreTag.classList.remove('active')
    this.hideExpansion()
  }

  showExpansion() {
    if (!dragController.isDragging) {
      const bounds = this.container.getBoundingClientRect()
      const leftBound = uiStore.isWideView ? bounds.left : bounds.right - 250
      uiStore.showCoursePopup(this.props.data, leftBound + window.scrollX, bounds.bottom + window.scrollY)
    }
  }

  hideExpansion() {
    uiStore.hideCoursePopup()
  }

  render() {
    const { index } = this.props
    const { department, courseNumber, modifier, name, geneds, description, credits } = this.props.data
    const colorStyle = { backgroundColor: `hsl(${colorController.getSearchResultHue(department)}, 80%, 80%)` }
    return (
      <div
        id={`search-result-${index}`}
        onMouseOver={() => {
          if (!dragController.isDragging) {
            this.activateMoreTag()
          }
        }}
        ref={el => this.container = el}
        onMouseLeave={() => this.deactivateMoreTag()}
        onMouseDown={() => this.deactivateMoreTag()}
        className="SearchBarResults-result"
      >
        <div className="dept-num" style={colorStyle}>
          <span>{department}<br />{courseNumber}{modifier}</span>
        </div>
        <span className="more" onMouseOver={() => this.showExpansion()} onMouseOut={() => this.hideExpansion()} ref={el => this.moreTag = el}>...</span>
        <span ref={el => this.nameEl = el} className="name">{name}<span ref={el => this.elipsesEl = el} className="elipses"></span></span>
        {geneds.length > 0 &&
          <div className="geneds">{geneds.map(g => <span key={`${this.counter++}-rge`}>{g}</span>)}</div>
        }
      </div>
    )
  }
}