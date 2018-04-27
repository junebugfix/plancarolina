import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import { colorController } from '../ColorController'
import Course, { CourseData } from './Course'
import '../styles/SearchBarResults.css'

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

  isOverflowing() {
    return Math.abs(this.nameEl.clientWidth - this.nameEl.scrollWidth) > 2 || Math.abs(this.nameEl.clientHeight - this.nameEl.scrollHeight) > 2
  }

  componentDidMount() {
    if (this.isOverflowing()) {
      this.elipsesEl.innerHTML = '...'
      this.nameEl.style.alignItems = 'flex-start'
    }
  }

  render() {
    const { data, index } = this.props
    const { department, courseNumber, modifier, name } = data
    const colorStyle = { backgroundColor: `hsl(${colorController.getSearchResultHue(department)}, 80%, 80%)` }
    return (
      <div id={`search-result-${index}`} className="SearchBarResults-result">
        <div className="dept-num" style={colorStyle}>
          <span>{department}<br />{courseNumber}{modifier}</span>
        </div>
        <span ref={el => this.nameEl = el} className="name">{name}<span ref={el => this.elipsesEl = el} className="elipses"></span></span>
      </div>
    )
  }
}