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
    if (uiStore.searchResults.length === 0) {
      return (
        <div id="searchBarResults" ref={el => this.divEl = el} className="SearchBarResults">
          <div className="search-bar-welcome">
            <h3>Plan your UNC career</h3>
            <p>
              Get started by adding your major with the button above, or by searching for courses to add to your schedule.
            </p>
          </div>
        </div>
      )
    }
    return (
      <div id="searchBarResults" ref={el => this.divEl = el} className="SearchBarResults">
          {uiStore.searchResults.map(res => <SearchBarResult key={`bar-result=${res.id}`} data={res} />).slice(0, uiStore.numberOfSearchResults)}
      </div>
    )
  }
}