import { MouseEvent, ChangeEvent, KeyboardEvent } from 'react'
import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'

export interface NewCourseData {
  id: number,
  department: string,
  number: number,
  geneds: string[],
  description: string
}

class UIStore {

  @observable departmentHues = new Map<string, number>()

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
  allDepartments: string[]
  departmentInput: HTMLInputElement
  fuzzysearch: Function

  constructor() {
    this.allDepartments = Object.keys(Departments).filter(x => parseInt(x, 10) > 0).map(x => Departments[x])
    this.fuzzysearch = require('fuzzysearch')
  }

  @action.bound registerDepartmentInput(input: HTMLInputElement) {
    this.departmentInput = input
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

  @action.bound handleSearchingDepartmentChange(e: ChangeEvent<HTMLInputElement>) {
    this.departmentResults = this.allDepartments.filter(x => this.fuzzysearch(e.target.value.toLowerCase(), x.toLowerCase()))
    this.isSearchingDepartment = e.target.value === '' ? false : true
  }

  @action.bound handleGenedAdded(e: Event) {
    this.searchGeneds = (e.target as HTMLInputElement).value.split(',')
    this.updateSearchResults()
  }

  @action.bound handleDepartmentResultChosen(result: string) {
    this.searchDepartment = result
    this.departmentInput.value = result
    this.departmentResults = []
  }

  updateSearchResults() {
    // put request to database here
    this.searchResults = require('./fakeApiResponse.json')
  }

  getSemesterLabel(index: Semesters) {
    if ([Semesters.Fall1, Semesters.Fall2, Semesters.Fall3, Semesters.Fall4, Semesters.Fall5].indexOf(index) !== -1) {
      return 'Fall'
    } else {
      return 'Spring'
    }
  }
}

export const uiStore = new UIStore()