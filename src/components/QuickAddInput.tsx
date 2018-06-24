import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import '../styles/QuickAddInput.css'
import { CourseData } from './Course'
import { dragController } from '../DragController'
import CourseSearch from '../CourseSearch'
import { coursesStore } from '../CoursesStore'
import { uiStore } from '../UIStore'
import SearchResults from './SearchResults'
import SearchBarResult from './SearchBarResult'
import { Semesters, isRightSemester, isBottomSemester, isChildOfClass } from '../utils'

interface Props {
  semesterIndex: Semesters
  onAdd: (c: CourseData) => void
  onBlur: (e?: React.FocusEvent<any>) => void
}

interface State {
  isLoadingCourses: boolean
  searchResults: CourseData[]
  highlightedIndex: number
}

const TAB_KEY = 9
const RIGHT_KEY = 39
const LEFT_KEY = 37
const ENTER_KEY = 13
const ESCAPE_KEY = 27

@observer
export default class QuickAddInput extends React.Component<Props, State> {
  counter = 0
  inputEl: HTMLInputElement
  maxLeft: number

  constructor(props: Props) {
    super(props)
    this.state = {
      isLoadingCourses: false,
      searchResults: [],
      highlightedIndex: 0
    }
  }

  componentDidMount() {
    this.inputEl.focus()
    this.maxLeft = document.getElementById('quick-results-scroll-container').getBoundingClientRect().left
    document.addEventListener('mousedown', e => {
      const target = e.target as any
      if (target.id !== 'quick-search-input' && !isChildOfClass('quick-search-results', target)) {
        this.props.onBlur()
      }
    }, { once: true } as any)
  }

  handleSearch(e: React.FormEvent<HTMLInputElement>) {
    uiStore.hideCoursePopup()
    const value = (e.target as HTMLInputElement).value
    const search = CourseSearch.fromString(value)
    if (search.isEmpty()) {
      this.setState({ 
        isLoadingCourses: false,
        searchResults: [],
        highlightedIndex: 0
       })
    } else {
      coursesStore.search(search).then(results => {
        const quickResults = results.slice(0, 10)
        this.setState({
          isLoadingCourses: false,
          searchResults: quickResults,
          highlightedIndex: 0
        })
        coursesStore.getDescriptions(quickResults.map(c => c.id))
          .catch(err => console.log(err))
      }).catch(err => {
        if (err === coursesStore.COURSES_NOT_LOADED_ERROR) {
          this.setState({ isLoadingCourses: true })
          uiStore.registerQuickSearchPending(this, e)
        }
      })
    }
  }

  updateHighlightedIndex(index: number) {
    if (index !== this.state.highlightedIndex) {
      const resultsScrollContainer = document.getElementById('quick-results-scroll-container')
      const resultsElementsContainer = document.getElementById('quick-results-container')
      const newResult = resultsElementsContainer.children[index] as HTMLElement
      const newResultBounds = newResult.getBoundingClientRect()
      console.log(newResultBounds.left, this.maxLeft)
      const newResultLeftOffset = newResult.offsetLeft
      const oldIndex = this.state.highlightedIndex
      if (index > oldIndex && newResultBounds.right > this.maxLeft + 300) {
        resultsScrollContainer.scrollLeft = newResultLeftOffset - 300 + 130
      } else if (index < oldIndex && newResultBounds.left < this.maxLeft) {
        resultsScrollContainer.scrollLeft = newResultLeftOffset - 6
      }
      this.setState({ highlightedIndex: index })
    }
  }

  addCourse(course: CourseData) {
    this.props.onAdd(course)
    this.inputEl.value = ''
    this.setState({
      isLoadingCourses: false,
      searchResults: [],
      highlightedIndex: 0
    })
  }

  handleInputKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === ESCAPE_KEY) {
      this.props.onBlur()
    } else {
      const { searchResults, highlightedIndex: oldIndex } = this.state
      if (searchResults.length > 0) {
        if (e.keyCode === ENTER_KEY) {
          this.addCourse(searchResults[oldIndex])
        } else if ((e.keyCode === TAB_KEY && !e.shiftKey) || e.keyCode === RIGHT_KEY) {
          e.preventDefault()
          const newIndex = oldIndex === searchResults.length - 1 ? 0 : oldIndex + 1
          this.updateHighlightedIndex(newIndex)
        } else if ((e.keyCode === TAB_KEY && e.shiftKey) || e.keyCode === LEFT_KEY) {
          e.preventDefault()
          const newIndex = oldIndex === 0 ? 0 : oldIndex - 1
          this.updateHighlightedIndex(newIndex)
        }
      }
    }
  }

  render() {
    const { isLoadingCourses, searchResults, highlightedIndex } = this.state
    const classes = ['QuickAddInput', 'undraggable']
    if (isRightSemester(this.props.semesterIndex)) {
      classes.push('right-align')
    }
    if (isBottomSemester(this.props.semesterIndex)) {
      classes.push('bottom-align')
    }
    return (
      <div className={classes.join(' ')}>
        <input className="undraggable" id="quick-search-input" onKeyDown={e => this.handleInputKeydown(e)} onInput={e => this.handleSearch(e)} ref={el => this.inputEl = el} />
        <div className="quick-search-results" id="quick-results-scroll-container">
          <div className="box" id="quick-results-container">
            {isLoadingCourses ?
              <span className="loading-courses">Loading Courses...</span>
            :
              searchResults.length === 0 ?
                <span className="search-prompt">Search for a course...<br /><span className="examples">"comp 110" or "intro programming"</span></span>
              :
              searchResults.map((c, index) => {
                const outlined = highlightedIndex === index
                return (
                  <SearchBarResult outlined={outlined} onClick={() => this.addCourse(c)} data={c} index={index} key={`${index}-qsr`} />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}