import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import SearchBarResult from './SearchBarResult'
import CourseData from './Course'
import Spinner from './Spinner'
import '../styles/SearchBarResults.css'
import { dragController } from '../DragController'
import { coursesStore } from '../CoursesStore'
import { colorController } from '../ColorController'
import { Departments } from '../departments'

interface Props {
  listView: boolean
}

interface State {
  listSectionsLoaded: number
}

@observer
export default class SearchBarResults extends React.Component<Props, State> {
  divEl: HTMLDivElement
  nameEl: HTMLSpanElement
  state = { listSectionsLoaded: 1 }

  componentDidMount() {
    dragController.registerDraggableList(this.divEl)
  }

  handleListScroll(e: React.UIEvent<HTMLDivElement>) {
    const container = (e.target) as HTMLDivElement
    const scrollRemaining = (container.scrollHeight - container.offsetHeight) - container.scrollTop
    if (scrollRemaining <= 300) {
      this.setState({ listSectionsLoaded: this.state.listSectionsLoaded + 1 })
    }
  }

  render() {
    if (uiStore.searchBarResultsPending) {
      return (
        <div ref={el => this.divEl = el} style={{ justifyContent: 'center', alignItems: 'center', fontSize: 22, color: '#666' }} className="SearchBarResults undraggable">
          Loading courses...
        </div>
      )
    }
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
    if (this.props.listView) {
      return (
        <div ref={el => { this.divEl = el; uiStore.searchResultsScrollEl = el }} onScroll={e => this.handleListScroll(e)} className="SearchBarResults list">
          {uiStore.searchResults.slice(0, (this.state.listSectionsLoaded * 10) + 1).map((c, index) => {
            const color = `hsl(${colorController.getSearchResultHue(c.department)}, 80%, 80%)`
            return (
              <div id={`search-result-${index}`} className="search-result list-result" key={`${index}-lr`}>
                <div className="top">
                  <span className="dept-num" style={{ backgroundColor: color }}>{c.department} {c.courseNumber}{c.modifier}</span>
                  <span className="name">{c.name}</span>
                </div>
                <div className="mid">
                  {c.geneds.length > 0 && <span className="geneds">{c.geneds.map((g, i) => <span className="gened-block" key={`${index}${i}-lvge`}>{g}</span>)}</span>}
                  <span className="credits">credits: {c.credits}</span>
                </div>
                <div
                  className="desc"
                  ref={el => {
                    if (!coursesStore.descriptions[c.id]) {
                      uiStore.registerDescriptionPending(c.id, el)
                    }
                  }}
                >
                {coursesStore.descriptions[c.id] || 'Loading description...'}
                </div>
              </div>
            )
          })}
        </div>
      )
    }
    return (
      <div ref={el => this.divEl = el} className="SearchBarResults">
          {uiStore.searchResults.slice(0, uiStore.numberOfSearchResults).map((result, index) => <SearchBarResult key={`bar-result-${result.id}`} index={index} data={result} />)}
          {!uiStore.hasAddedACourse && <div className="undraggable drag-prompt">Drag a course into your schedule {uiStore.isWideView ? '→' : '↓'}</div>}
      </div>
    )
  }
}