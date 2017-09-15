import { MouseEvent, ChangeEvent } from 'react'
import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import * as Fuse from 'fuse.js'

export interface NewCourseData {
  department: string,
  number: number,
  geneds: string[],
  requirements: string,
  description: string
}

class UIStore {

  readonly carolinaBlue = '#4B9CD3'
  readonly lightBlue = '#BAE3F8'
  readonly lightColor = '#FFF4E1'
  readonly middleColor = '#ffc6aa'
  readonly accentColor = '#E67A7A'

  @observable departmentHues = new Map<string, number>()

  departmentSearch: Fuse
  demoDBSearch: Fuse

  @observable fall5Active = false
  @observable spring5Active = false
  @observable isSearchingDepartment = true
  @observable isSearchingName = true

  @observable departmentResults: string[] = []

  @observable searchDepartment = ""
  @observable searchNumber: number
  @observable searchNumberFilter = ((x: number) => x === this.searchNumber)
  @observable searchName = ""
  @observable searchGeneds: string[] = []

  @observable searchResults: NewCourseData[] = []

  lastHue = 0
  allCourses: NewCourseData[]

  @action.bound initCourseData() {
    let coursesPromise = import('./introCourses.js').then(module => {
      this.allCourses = module.courses
      this.demoDBSearch = new Fuse(module.courses, {
        keys: ['department', 'number', 'name']
      })
    })
    let departments = Object.keys(Departments).filter(v => parseInt(v, 10) >= 0).map(v => Departments[v])
    this.departmentSearch = new Fuse(departments.map(v => ({ name: v })), {
      keys: ['name'],
      id: 'name'
    })
  }

  @action.bound handleNumberOperatorChange(e: ChangeEvent<HTMLSelectElement>) {
    const newValue = e.target.value
    if (newValue === '=') {
      this.searchNumberFilter = ((x: number) => x === this.searchNumber)
    } else if (newValue === '>=') {
      this.searchNumberFilter = ((x: number) => x >= this.searchNumber)
    } else if (newValue === '<=') {
      this.searchNumberFilter = ((x: number) => x <= this.searchNumber)
    }
    this.updateSearchResults()
  }

  @action.bound handleSearchingNumber(e: ChangeEvent<HTMLInputElement>) {
    let val = parseInt(e.target.value, 10)
    if (val > 0) {
      this.searchNumber = val
    }
    this.updateSearchResults()
  }

  @action.bound handleSearchingName(e: ChangeEvent<HTMLInputElement>) {
    this.searchName = e.target.value
    this.updateSearchResults()
  }

  @action.bound handleSearchingDepartment(e: ChangeEvent<HTMLInputElement>) {
    this.departmentResults = (this.departmentSearch.search(e.target.value) as string[]).slice(0, 6)
  }

  @action.bound handleGenedAdded(e: Event) {
    this.searchGeneds = (e.target as HTMLInputElement).value.split(',')
    this.updateSearchResults()
  }

  updateSearchResults() {
    // put request to database here
    let results: NewCourseData[] = this.searchName === '' ? this.allCourses : this.demoDBSearch.search(this.searchName)
    results.filter(v => this.searchNumber === undefined ? true : this.searchNumberFilter(v.number))
      .filter(v => this.searchDepartment === '' ? true : v.department === this.searchDepartment)
      .filter(v => this.searchGeneds.length === 0 ? true : v.geneds.filter(x => this.searchGeneds.indexOf(x) === -1).length === 0)
    this.searchResults = results.length === this.allCourses.length ? [] : results
  }

  getSemesterLabel(index: Semesters) {
    if (this.isFallSemester(index)) {
      return 'Fall'
    } else {
      return 'Spring'
    }
  }

  private isFallSemester(index: Semesters) {
    return [Semesters.Fall1, Semesters.Fall2, Semesters.Fall3, Semesters.Fall4, Semesters.Fall5].indexOf(index) !== -1
  }

}

export const uiStore = new UIStore()