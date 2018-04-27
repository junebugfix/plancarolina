import { MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import { observable, action, computed, autorun } from 'mobx';
import { Semesters, getObjectValues } from './utils';
import { Departments } from './departments';
import { CourseData } from './components/Course';
import { scheduleStore } from './ScheduleStore';
import { loginStore, HandleConflictResult } from './LoginStore';
import { colorController } from './ColorController';
import CourseSearch, { ALL_GENEDS } from './CourseSearch'
import * as Cookies from 'js-cookie';
import difference from 'lodash-es/difference';
import './styles/AddMajorPopup.css';
import Dialog, { DialogOptions } from './components/Dialog';
import Snackbar, { SnackbarOptions } from './components/Snackbar';

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
  @observable isLoadingSearchResults = false
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

  @observable firstYearSummerActive = false
  @observable sophomoreSummerActive = false
  @observable juniorSummerActive = false
  @observable seniorSummerActive = false

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
  majors: string[] = []

  @computed get isWideView() {
    return this.windowWidth > 950
  }

  @computed get isMobileView() {
    return this.windowWidth <= 650
  }

  @computed get courseHeight() {
    if (this.expandedView) {
      return 44
    } else if (this.isMobileView) {
      return 21
    }
    return 26
  }

  @computed get semesterHeight() {
    const longestSemesterLength = Math.max(...scheduleStore.semestersArray.map(s => s.length))
    return Math.max((longestSemesterLength * this.courseHeight) + 10, 30)
  }

  @computed get isAnySummerActive() {
    return this.firstYearSummerActive || this.sophomoreSummerActive || this.juniorSummerActive || this.seniorSummerActive
  }

  @computed get summerHeight() {
    return scheduleStore.summersArray.reduce((memo: number, summer: CourseData[]) => {
      return summer.length > memo ? summer.length : memo
    }, 0) * 20 + 40
  }

  @computed get userSettings(): UserSettings {
    return {
      expandedView: this.expandedView,
      firstYearSummerActive: this.firstYearSummerActive,
      sophomoreSummerActive: this.sophomoreSummerActive,
      juniorSummerActive: this.juniorSummerActive,
      seniorSummerActive: this.seniorSummerActive,
      fall5Active: this.fall5Active,
      spring5Active: this.spring5Active,
      majors: this.majors,
      departmentHues: colorController.getScheduleHuesObject()
    }
  }

  readonly MAJOR_LABEL = "major-res"
  readonly DEPARTMENT_LABEL = "dept-res"

  lastSearchResultUpdate = Date.now()
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

      // if (scheduleStore.slipListsActive && this.isMobileView) {
        // scheduleStore.disconnectSlipLists()
      // }
    })
  }

  private isReorderWithinList(e: Event): boolean {
    return (e.target as HTMLDivElement).classList.contains('Course')
  }

  private isDuplicate(searchResultIndex: number) {
    return scheduleStore.allCourses.map(c => c.id).indexOf(this.searchResults.map(r => r.id)[searchResultIndex]) !== -1
  }

  showDialog(options: DialogOptions) {
    this.dialog.options = options
    this.dialog.open = true
  }

  alertNetworkError(retryFn?: (e: any) => void) {
    const options: SnackbarOptions = { message: 'Could not connect to internet' }
    if (retryFn) {
      options.actionLabel = 'Retry'
      options.action = retryFn
    }
    this.snackbarAlert(options)
  }

  // @action.bound registerSlipList(el: HTMLDivElement) {
  //   let slipList = new this.slip(el)
  //   el.addEventListener('slip:reorder', (e: any) => {
  //     if (e.detail.origin.container.classList.contains('SearchBarResults')) {
  //       const searchResultIndex = e.detail.originalIndex
  //       const semesterIndex = Semesters[e.target.id as string]
  //       let toIndex = e.detail.spliceIndex
  //       if (this.isDuplicate(searchResultIndex)) {
  //         e.preventDefault()
  //         this.snackbarAlert({ message: 'That course is already in your schedule.' })
  //         return
  //       }
  //       scheduleStore.insertSearchResult(searchResultIndex, semesterIndex, toIndex)
  //       this.searchResults.splice(searchResultIndex, 1)
  //     } else if (this.isReorderWithinList(e)) {
  //       scheduleStore.reorderInList(e.target, e.detail.originalIndex, e.detail.spliceIndex)
  //     } else { // course was dragged to a different list
  //       const toList = e.target
  //       const fromList = e.detail.origin.container
  //       const toIndex = e.detail.spliceIndex
  //       const fromIndex = e.detail.originalIndex
  //       scheduleStore.changeLists(fromList, fromIndex, toList, toIndex)
  //     }
  //   })
  //   scheduleStore.connectSlipList(slipList)
  // }

  // @action.bound registerSearchBarResults(el: HTMLDivElement) {
  //   let slipList = new this.slip(el)
  //   // prevent dragging the welcome text
  //   el.addEventListener('slip:beforeswipe', (e) => {
  //     if ((e.target as HTMLElement).classList.contains('undraggable')) {
  //       e.preventDefault()
  //     }
  //   })
  //   el.addEventListener('slip:beforereorder', (e) => {
  //     if ((e.target as HTMLElement).classList.contains('undraggable')) {
  //       e.preventDefault()
  //     }
  //   })
  //   // scheduleStore.connectSlipList(slipList)
  // }

  @action.bound deactivateSummer(index: number) {
    switch (index) {
      case Semesters.Summer1:
        this.firstYearSummerActive = false
        break;
      case Semesters.Summer2:
        this.sophomoreSummerActive = false
        break;
      case Semesters.Summer3:
        this.juniorSummerActive = false
        break;
      case Semesters.Summer4:
        this.seniorSummerActive = false
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
    this.expandedView = settings.expandedView || this.expandedView
    this.firstYearSummerActive = settings.firstYearSummerActive || this.firstYearSummerActive
    this.sophomoreSummerActive = settings.sophomoreSummerActive || this.sophomoreSummerActive
    this.juniorSummerActive = settings.juniorSummerActive || this.juniorSummerActive
    this.seniorSummerActive = settings.seniorSummerActive || this.seniorSummerActive
    this.fall5Active = settings.fall5Active || this.fall5Active
    this.spring5Active = settings.spring5Active || this.spring5Active
    this.majors = settings.majors || this.majors
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

  updateSearchResults(search: CourseSearch) {
    console.log(search)
    this.isLoadingSearchResults = true
    colorController.clearSearchResultHues()
    fetch(search.url).then(res => {
      res.json().then(data => {
        this.searchResults = data.results
        this.isLoadingSearchResults = false
      })
    })
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