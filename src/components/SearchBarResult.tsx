import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import { colorController } from '../ColorController'
import Course from './Course'
import CourseData from './Course'
import '../styles/SearchBarResults.css'

interface SearchBarResultData {
  department: string
  number: string
  name: string
}

@observer
export default class SearchBarResult extends React.Component<{data: SearchBarResultData}, {}> {
  nameEl: HTMLSpanElement
  elipsesEl: HTMLSpanElement

  isOverflowing(name: string) {
    return this.nameEl.clientWidth < this.nameEl.scrollWidth || this.nameEl.clientHeight < this.nameEl.scrollHeight
  }

  componentDidMount() {
    if (this.isOverflowing(this.props.data.name)) {
      this.elipsesEl.innerHTML = '...'
    }
  }

  render() {
    const res = this.props.data
    const style = {
      background: `hsl(${colorController.getSearchResultHue(res.department)}, 80%, 80%)`
    }
    return (
      <div className="SearchBarResults-result" style={style}>
        <div className="dept-num">
          <span className="department">{res.department}</span>
          <br />
          <span className="number">{res.number}</span>
        </div>
        <span ref={el => this.nameEl = el} className="name">{res.name}<span ref={el => this.elipsesEl = el} className="elipses"></span></span>
      </div>
    )
  }
}