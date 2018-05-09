import { MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import { observable, action, computed, autorun } from 'mobx';
import { Semesters, getObjectValues } from './utils';
import { Departments } from './departments';
import { CourseData } from './components/Course';
import { scheduleStore } from './ScheduleStore';
import { coursesStore } from './CoursesStore';
import { loginStore, HandleConflictResult } from './LoginStore';
import { colorController } from './ColorController';
import CourseSearch, { ALL_GENEDS } from './CourseSearch'
import * as Cookies from 'js-cookie';
import difference from 'lodash-es/difference';
import './styles/AddMajorPopup.css';
import Dialog, { DialogOptions } from './components/Dialog';
import Snackbar, { SnackbarOptions } from './components/Snackbar';
import SearchBar from './components/SearchBar';

interface MajorData {
  name: string
  absoluteCourses: string[]
  additionalCourses: number
  urls: string[]
}

export interface UserSettings {
  expandedView: boolean
  majors: string[]
  departmentHues: { [dept: string]: number }
  fall5Active: boolean
  spring5Active: boolean
  firstYearSummerActive: boolean
  sophomoreSummerActive: boolean
  juniorSummerActive: boolean
  seniorSummerActive: boolean
}

class UIStore {
  @observable fall5Active = false
  @observable spring5Active = false
  @observable isSearchingDepartment = false
  @observable isSearchingName = false
  @observable isSearchingMajor = false
  @observable addMajorPopupActive = false
  @observable loginPopupActive = false
  @observable expandedView = false
  @observable searchPending = false
  @observable hasSetScheduleLoadInterval = false
  @observable hasAddedACourse = false
  @observable yearEnteredPromptActive = false
  @observable addClassPopupActive = false
  @observable loginAlertActive = false
  @observable persistentLoginAlertActive = false
  @observable addMajorAlertActive = false
  @observable shouldPromptAddMajor = true
  @observable promptHandleConflictPopup = false
  @observable shouldPromptForLogin = true

  @observable majorResults: string[] = []
  @observable departmentResults: string[] = []
  @observable currentSearch: CourseSearch = new CourseSearch()

  @observable summer1Active = false
  @observable summer2Active = false
  @observable summer3Active = false
  @observable summer4Active = false

  @observable searchDepartment = ""
  @observable searchNumber: number
  @observable searchNumberOperator = 'eq'
  @observable searchKeywords = ""
  @observable searchGeneds: string[] = []
  @observable searchResults: CourseData[] = []
  @observable numberOfSearchResults = this.isWideView ? 10 : 9
  @observable windowWidth = window.innerWidth

  yearEnteredCallback: Function
  dialog: Dialog
  snackbar: Snackbar
  coursePopup: HTMLElement
  majors: string[] = []
  currentPopupDescEl: HTMLElement
  currentPopupId: number
  getDescriptionsTimeout
  searchBar: SearchBar

  readonly SEARCH_UPDATE_INTERVAL_MS = 150

  @computed get isWideView() {
    return this.windowWidth > 950
  }

  @computed get isMobileView() {
    return this.windowWidth <= 600
  }

  @computed get courseHeight() {
    if (this.expandedView) {
      return 30
    } else if (this.isMobileView) {
      return 21
    }
    return 26
  }

  @computed get semesterHeight() {
    const longestSemesterLength = Math.max(...scheduleStore.semestersArray.map(s => s.length))
    return Math.max((longestSemesterLength * this.courseHeight) + 30, 30)
  }

  @computed get isAnySummerActive() {
    return this.summer1Active || this.summer2Active || this.summer3Active || this.summer4Active
  }

  @computed get summerHeight() {
    return scheduleStore.summersArray.reduce((memo: number, summer: CourseData[]) => {
      return summer.length > memo ? summer.length : memo
    }, 0) * 20 + 40
  }

  @computed get userSettings(): UserSettings {
    return {
      expandedView: this.expandedView,
      firstYearSummerActive: this.summer1Active,
      sophomoreSummerActive: this.summer2Active,
      juniorSummerActive: this.summer3Active,
      seniorSummerActive: this.summer4Active,
      fall5Active: this.fall5Active,
      spring5Active: this.spring5Active,
      majors: this.majors,
      departmentHues: colorController.getScheduleHuesObject()
    }
  }

  readonly MAJOR_LABEL = "major-res"
  readonly DEPARTMENT_LABEL = "dept-res"

  yearEntered: number;
  departmentNames: string[]
  majorNames: string[] = []
  majorData: MajorData[]
  fuzzysearch: Function
  slip: any

  constructor() {
    this.departmentNames = Object.keys(Departments).filter(x => parseInt(x, 10) > 0).map(x => Departments[x])
    this.majorData = require('./majorCountWithoutComments.json').majors
    for (let key in this.majorData) {
      this.majorNames.push(this.majorData[key].name)
    }
    this.fuzzysearch = require('fuzzysearch')
    this.slip = require('./multislip.js')
    
    window.addEventListener('resize', e => {
      this.windowWidth = window.innerWidth
      if (this.isWideView && this.numberOfSearchResults !== 10) {
        this.numberOfSearchResults = 10
      } else if (!this.isWideView && !this.isMobileView && this.numberOfSearchResults !== 9) {
        this.numberOfSearchResults = 9
      } else if (this.isMobileView) {
        this.numberOfSearchResults = 6
      }
    })
  }

  private isDuplicate(searchResultIndex: number) {
    return scheduleStore.allCourses.map(c => c.id).indexOf(this.searchResults.map(r => r.id)[searchResultIndex]) !== -1
  }

  showDialog(options: DialogOptions) {
    this.dialog.options = options
    this.dialog.open = true
  }

  handleDescriptionLoaded(id: number, description: string) {
    if (this.currentPopupId === id) {
      this.currentPopupDescEl.innerText = description
    }
  }

  showCoursePopup(data: CourseData, left: number, top: number, bottom?: number) {
    if (top && bottom) throw new Error('defined both top and bottom')
    const popup = document.createElement('div')
    popup.classList.add('course-popup')
    popup.style.left = `${left}px`
    if (bottom) {
      popup.style.bottom = `${window.innerHeight - bottom}px`
    } else {
      popup.style.top = `${top}px`
    }

    const title = document.createElement('div')
    title.classList.add('title')
    title.innerText = `${data.department} ${data.courseNumber}: ${data.name}`

    const stats = document.createElement('div')
    stats.classList.add('stats')

    const geneds = document.createElement('span')
    geneds.innerText = `Geneds: ${data.geneds.join(' ')}`

    const credits = document.createElement('span')
    credits.innerText = `Credits: ${data.credits}`

    const description = document.createElement('div')
    description.innerText = coursesStore.descriptions[data.id] || 'Loading description...'
    this.currentPopupDescEl = description

    popup.appendChild(title)
    stats.appendChild(geneds)
    stats.appendChild(credits)
    popup.appendChild(stats)
    popup.appendChild(description)

    this.coursePopup = popup
    this.currentPopupId = data.id
    document.body.appendChild(popup)
  }

  hideCoursePopup() {
    if (this.coursePopup) {
      this.coursePopup.remove()
    }
  }

  alertNetworkError(retryFn?: (e: any) => void) {
    const options: SnackbarOptions = { message: 'Could not connect to internet' }
    if (retryFn) {
      options.actionLabel = 'Retry'
      options.action = retryFn
    }
    this.snackbarAlert(options)
  }

  @action.bound deactivateSummer(index: number) {
    switch (index) {
      case Semesters.Summer1:
        this.summer1Active = false
        break;
      case Semesters.Summer2:
        this.summer2Active = false
        break;
      case Semesters.Summer3:
        this.summer3Active = false
        break;
      case Semesters.Summer4:
        this.summer4Active = false
        break;
      default:
        break;
    }
    this.saveSettings()
  }

  @action.bound handleAddMajorClicked(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).classList.contains('Toolbar-item') || (e.target as HTMLElement).classList.contains('Toolbar-text')) {
      this.addMajorPopupActive = !this.addMajorPopupActive
      this.alertAddMajor()
    }
  }

  @action.bound handleLoginPopupClicked(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).classList.contains('Toolbar-item') || (e.target as HTMLElement).classList.contains('Toolbar-text')) {
      this.loginPopupActive = !this.loginPopupActive
    }
  }

  @action.bound handleSearchResultChosen(label: string, result: string) {
    if (label === this.MAJOR_LABEL) {
      this.handleMajorResultChosen(result)
    } else if (label === this.DEPARTMENT_LABEL) {
      // this.handleDepartmentResultChosen(result)
    }
  }

  @action.bound handleRemoveCourse(e: MouseEvent<HTMLSpanElement>) {
    let course = (e.target as HTMLDivElement).parentNode
    // get index of course in semester
    let semesterIndex = Semesters[course.parentElement.id]
    let courseIndex = 0
    while ((course = course.previousSibling) != null) {
      courseIndex++
    }
    scheduleStore.removeCourseFromSemester(courseIndex, semesterIndex)
  }

  @action.bound loadSettings(settings: UserSettings) {
    this.expandedView = settings.expandedView
    this.summer1Active = settings.firstYearSummerActive
    this.summer2Active = settings.sophomoreSummerActive
    this.summer3Active = settings.juniorSummerActive
    this.summer4Active = settings.seniorSummerActive
    this.fall5Active = settings.fall5Active
    this.spring5Active = settings.spring5Active
    this.majors = settings.majors
    colorController.loadDepartmentHues(settings.departmentHues)
    this.forceUpdateSchedule()
  }

  @action.bound forceUpdateSchedule() {
    this.expandedView = !this.expandedView
    this.expandedView = !this.expandedView
  }

  saveSettings() {
    if (!loginStore.isLoggedIn) return
    const requestBody = {
      settings: JSON.stringify(this.userSettings),
      email: loginStore.email
    }
    fetch('/api/api2.cgi/saveUserSettings', {
      method: 'put',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  snackbarAlert(options: SnackbarOptions) {
    this.snackbar.options = options
    this.snackbar.open = true
  }

  private handleMajorResultChosen(majorName: string) { 
    let schedule = document.querySelector(".Schedule");
    let loader = document.createElement("div");
    let data = this.majorData.filter(x => x.name === majorName)[0]
    if (this.yearEntered === undefined) {
      this.promptYearEntered().then(year => {
        this.yearEnteredPromptActive = false
        this.yearEntered = year
        let url = data.urls[this.yearEntered]
        // this.showOpenWorksheetButton(url)
      })
    } else {
      let url = data.urls[this.yearEntered]
      // this.showOpenWorksheetButton(url)
    }
    loader.id = "loading-circle";
    schedule.appendChild(loader);
    this.addMajorPopupActive = false
    Promise.all(data.absoluteCourses.map(c => this.fetchCourseData(c))).then(courses => {
      scheduleStore.addCourses(courses)
      schedule.removeChild(loader)
    })
  }

  private promptYearEntered(): Promise<number> {
    this.yearEnteredPromptActive = true;
    return new Promise((resolve, reject) => {
      this.yearEnteredCallback = (year: number) => resolve(year)
    })
  }

  private fetchCourseData(name: string): Promise<CourseData> {
    let dept = name.split(' ')[0]
    let numStr = name.split(' ')[1]
    let num: number
    let mod = 'N'
    if (numStr[numStr.length - 1] === "H" || numStr[numStr.length - 1] === "L") {
      mod = numStr[numStr.length - 1]
      num = Number(numStr.slice(0, numStr.length - 1))
    } else {
      num = Number(numStr)
    }
    return new Promise((resolve, reject) => {
      fetch(`/api/api2.cgi/courses/${dept}/${num}/${mod}`).then(res => {
        if (res.ok) {
          res.json().then(resolve).catch(reject)
        } else {
          reject(res)
        }
      })
    })
  }

  @computed get searchGenedsString() {
    return this.searchGeneds.join(',')
  }

  updateDescriptions() {
    console.log('updating descriptions...')
    if (this.searchResults.length > 0) {
      coursesStore.getDescriptions(this.searchResults.map(c => c.id)).then(res => {
        console.log('updated descriptions')
      }).catch(err => console.log(err))
    }
  }

  updateSearchResults(search: CourseSearch) {
    colorController.clearSearchResultHues()
    if (search.isEmpty()) {
      this.searchResults = []
    } else {
      console.log('not empty!')
      coursesStore.search(search).then(results => {
        this.searchResults = results
        clearTimeout(this.getDescriptionsTimeout)
        this.getDescriptionsTimeout = setTimeout(() => this.updateDescriptions(), 300)
      }).catch(reason => {
        if (reason === coursesStore.COURSES_NOT_LOADED_ERROR) {
          this.searchPending = true
        }
      })
    }
  }

  handleCoursesLoaded() {
    if (this.searchPending) {
      this.updateSearchResults(this.searchBar.search)
      this.searchPending = false
    }
  }

  registerSearchBar(searchBar: SearchBar) {
    this.searchBar = searchBar
  }

  promptUserLogin() {
    if ((!loginStore.isLoggedIn || !Cookies.get('token')) && uiStore.shouldPromptForLogin) {
      uiStore.loginAlertActive = true
      uiStore.shouldPromptForLogin = false
    }
  }

  alertAddMajor() {
    if (uiStore.shouldPromptAddMajor) {
      uiStore.addMajorAlertActive = true
    }
  }

  showOpenWorksheetButton(url: string) {
    window.open(url)
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