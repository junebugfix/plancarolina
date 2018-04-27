import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import SearchBarResult from './SearchBarResult'
import CourseData from './Course'
import '../styles/SearchBarResults.css'
import { dragController } from '../DragController';

@observer
export default class SearchBarResults extends React.Component {
  divEl: HTMLDivElement
  nameEl: HTMLSpanElement

  componentDidMount() {
    dragController.registerDraggableList(this.divEl)
  }

  render() {
    if (uiStore.searchResults.length === 0) {
      return (
        <div ref={el => this.divEl = el} className="SearchBarResults">
          <div className="undraggable search-bar-welcome">
            {!uiStore.isMobileView && <h3 className="undraggable">Plan your UNC career</h3>}
            <p className="undraggable">
              Get started by adding your major with the button above, or by searching for courses to drag into your schedule.
            </p>
          </div>
        </div>
      )
    }
    return (
      <div ref={el => this.divEl = el} className="SearchBarResults">
          {uiStore.searchResults.map((result, index) => <SearchBarResult key={`bar-result-${result.id}`} index={index} data={result} />).slice(0, uiStore.numberOfSearchResults)}
          {!uiStore.hasAddedACourse && <div className="undraggable drag-prompt">Drag a course into your schedule {uiStore.isWideView ? '→' : '↓'}</div>}
      </div>
    )
  }
}