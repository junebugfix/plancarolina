import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import SearchBarResult from './SearchBarResult'
import CourseData from './Course'
import '../styles/SearchBarResults.css'

@observer
export default class SearchBarResults extends React.Component {
  divEl: HTMLDivElement
  nameEl: HTMLSpanElement

  componentDidMount() {
    uiStore.registerSearchBarResults(this.divEl)
  }

  render() {
    return (
      <div id="searchBarResults" ref={el => this.divEl = el} className="SearchBarResults">
          {uiStore.searchResults.map(res => <SearchBarResult key={`bar-result=${res.id}`} data={res} />).slice(0, 9)}
      </div>
    )
  }
}