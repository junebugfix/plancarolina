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

interface MajorData {
  name: string
  absolute_courses: string[]
  additional_courses: number
  urls: string[]
}

class UIStore {
  @observable departmentHues = new Map<string, number>()

  @observable fall5Active = false
  @observable spring5Active = false
  @observable isSearchingDepartment = false
  @observable isSearchingName = false
  @observable isSearchingMajor = false
  @observable addMajorPopupActive = false
  @observable loginPopupActive = false

  @observable majorResults: string[] = []
  @observable departmentResults: string[] = []

  @observable searchDepartment = ""
  @observable searchNumber: number
  @observable searchNumberFilter = ((x: number) => x === this.searchNumber)
  @observable searchName = ""
  @observable searchGeneds: string[] = []

  @observable searchResults: NewCourseData[] = []

  readonly MAJOR_LABEL = "major-res"
  readonly DEPARTMENT_LABEL = "dept-res"

  lastHue = 0
  departmentNames: string[]
  majorNames: string[] = []
  majorData: MajorData[]
  departmentInput: HTMLInputElement
  fuzzysearch: Function

  constructor() {
    this.departmentNames = Object.keys(Departments).filter(x => parseInt(x, 10) > 0).map(x => Departments[x])
    let jsonMajorData = require('./majorCountWithoutComments.json')
    this.majorData = Object.keys(jsonMajorData).map(key => jsonMajorData[key]) // turn json object into an array
    for (let key in this.majorData) {
      this.majorNames.push(this.majorData[key].name)
    }
    this.fuzzysearch = require('fuzzysearch')
  }

  @action.bound registerDepartmentInput(input: HTMLInputElement) {
    this.departmentInput = input
  }

  @action.bound handleAddMajorClicked(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).classList.contains('Toolbar-item') || (e.target as HTMLElement).classList.contains('Toolbar-text')) {
      this.addMajorPopupActive = !this.addMajorPopupActive
    }
  }

  @action.bound handleLoginPopupClicked(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).classList.contains('Toolbar-item') || (e.target as HTMLElement).classList.contains('Toolbar-text')) {
      this.loginPopupActive = true
    }
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

  @action.bound handleSearchingMajor(e: ChangeEvent<HTMLInputElement>) {
    this.majorResults = this.majorNames.filter(x => this.fuzzysearch(e.target.value.toLowerCase(), x.toLowerCase()))
  }

  @action.bound handleSearchingDepartmentChange(e: ChangeEvent<HTMLInputElement>) {
    this.departmentResults = this.departmentNames.filter(x => this.fuzzysearch(e.target.value.toLowerCase(), x.toLowerCase()))
    this.isSearchingDepartment = e.target.value === '' ? false : true
  }

  @action.bound handleGenedAdded(e: Event) {
    this.searchGeneds = (e.target as HTMLInputElement).value.split(',')
    this.updateSearchResults()
  }

  @action.bound handleSearchResultChosen(label: string, result: string) {
    if (label === this.MAJOR_LABEL) {
      this.handleMajorResultChosen(result)
    } else if (label === this.DEPARTMENT_LABEL) {
      this.handleDepartmentResultChosen(result)
    }
  }

  private handleMajorResultChosen(result: string) {
    // TODO: show loading progress
    this.addMajorPopupActive = false
    let data = this.majorData.filter(x => x.name === result)[0]
    window.fetch('/api.cgi').then(res => res.json().then(fetchedData => {
      this.fillMajorData(fetchedData)
    })).catch(reject => console.log(reject))
  }

  private fillMajorData(data: any) {
    const semesterLimit = 5
    console.log(data)
  }

  private handleDepartmentResultChosen(result: string) {
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