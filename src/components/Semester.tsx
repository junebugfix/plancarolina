import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { scheduleStore } from '../ScheduleStore'
import Course from './Course'
import SearchBarResult from './SearchBarResult'
import { Departments } from '../departments'
import { Semesters } from '../utils'
import { uiStore } from '../UIStore'
import { CourseData } from './Course'
import { dragController } from '../DragController';
import '../styles/Semester.css'
import CourseSearch from '../CourseSearch';

@observer
export default class Semester extends React.Component<{ label: string, index: Semesters, type: 'normal' | 'mobile', courses: CourseData[] }, {}> {
  container: HTMLDivElement
  addBackground: HTMLDivElement
  addButton: HTMLButtonElement
  counter = 0
  @observable searchResults: CourseData[] = []

  constructor(props: { label: string, index: Semesters, type: 'normal' | 'mobile', courses: CourseData[] }) {
    super(props)
  }

  componentDidMount() {
    dragController.registerDraggableList(this.container)
  }

  @action.bound handleSearch(e: KeyboardEvent) {
    const value = (e.target as HTMLInputElement).value
    const search = CourseSearch.fromString(value)
    fetch(search.url).then(raw => raw.json().then(res => {
      (this.searchResults as any).replace(res.results);
    }))
  }

  handleAddClicked(e: React.MouseEvent<HTMLButtonElement>) {
    this.addBackground.style.display = 'none'
    this.addButton.style.display = 'none'
    const inputEl = document.createElement('input')
    inputEl.classList.add('undraggable')
    inputEl.oninput = this.handleSearch
    inputEl.onblur = () => {
      this.addBackground.style.display = ''
      this.addButton.style.display = ''
      inputEl.remove()
    }
    this.container.appendChild(inputEl)
    inputEl.focus()
  }

  render() {
    const style = { height: uiStore.semesterHeight }
    let classes = ['Semester']
    if (this.props.type === 'mobile') classes.push('mobile')
    if (this.props.label === 'Summer') {
      classes.push('summer')
      style.height = uiStore.summerHeight
    }
    return (
      <div className={classes.join(' ')}>
        <div className="Semester-label">{this.props.label}</div>
        <div ref={el => this.container = el as HTMLDivElement} style={style} className="Semester-courses" id={`${Semesters[this.props.index]}`}>
          {this.props.courses.map((data, index) => <Course key={`${data.id}-c`} courseIndex={index} semesterIndex={this.props.index} {...data} />)}
        </div>
        {/* <button ref={el => this.addButton = el} onClick={e => this.handleAddClicked(e)} className="Semester-add-button">+</button>
        <div ref={el => this.addBackground = el} className="Semester-add-background"></div>
        {this.searchResults.length > 0 &&
          <div className="search-results">
            {this.searchResults.map(c => {
            const { department, courseNumber, name } = c
            return (
              <div className="result" key={`${this.counter++}-csr`}>
                <span className="department">{department}</span>
                <span className="number">{courseNumber}</span>
                <span className="name">{name}</span>
              </div>
            )
            })}
          </div>
        } */}
      </div>
    )
  }
}
