import { observable, action, computed } from 'mobx'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { uiStore } from './UIStore'
import Schedule from './components/Schedule'
import Semester from './components/Semester'
import { Semesters, getClassElements, getChildren } from './utils'
import './scripts/platform.js'

class ScheduleStore {

  @observable fall1: CourseData[] = []
  @observable fall2: CourseData[] = []
  @observable fall3: CourseData[] = []
  @observable fall4: CourseData[] = []
  @observable fall5: CourseData[] = []
  @observable spring1: CourseData[] = []
  @observable spring2: CourseData[] = []
  @observable spring3: CourseData[] = []
  @observable spring4: CourseData[] = []
  @observable spring5: CourseData[] = []

  slipLists: any[] = []

  constructor() {
    this.initAllSemesters(require('./userData.json').semesters)
  }

  getCourseData(id: number): CourseData {
    return this.allCourses.filter((course: CourseData) => course.id === id)[0]
  }

  getSemesterData(index: number): CourseData[] {
    let data =  this.allSemesters[index]
    return data
  }

  findSemesterWithCourse(courseId: number): CourseData[] | null {
    for (let i = 0; i < this.allSemesters.length; i++) {
      for (let j = 0; j < this.allSemesters[i].length; j++) {
        if (this.allSemesters[i][j].id === courseId) {
          return this.allSemesters[i]
        }
      }
    }
    throw new Error(`Invalid course id: ${courseId}`)
  }

  addCourses(rawCourses: CourseData[]) {
    const semesterLimit = 5
    let courses = rawCourses.filter(c => c.id) // remove error: not found items
    let semesterIndex = 0
    courses.forEach(course => {
      if (this.getSemester(semesterIndex).length > semesterLimit - 1 || semesterLimit > this.allSemesters.length - 1) {
        semesterIndex += 1
      }
      this.getSemester(semesterIndex % this.allSemesters.length).push(course)
    })
  }

  @computed get allCourses(): CourseData[] {
    return new Array<CourseData>().concat(...this.allSemesters)
  }

  @computed get allSemesters(): CourseData[][] {
    return [
      this.fall1, this.fall2, this.fall3, this.fall4, this.fall5,
      this.spring1, this.spring2, this.spring3, this.spring4, this.spring5
    ]
  }

  @action.bound reorderInList(el: HTMLElement, startIndex: number, endIndex: number) {
    let semesterData = this.findSemesterWithCourse(parseInt(el.id.substring(7), 10)) as CourseData[]
    semesterData.splice(endIndex, 0, semesterData.splice(startIndex, 1)[0])
  }

  @action.bound changeLists(fromList: HTMLElement, fromIndex: number, toList: HTMLElement, toIndex: number) {
    console.log(fromList, toList)
    let fromSemesterData = this.getSemester(Semesters[fromList.id])
    let toSemesterData = this.getSemester(Semesters[toList.id])
    toSemesterData.splice(toIndex, 0, fromSemesterData.splice(fromIndex, 1)[0])
  }

  @action.bound insertSearchResult(index: number): any {
      let result = uiStore.searchResults[index]
      console.log(result)
  }

  connectSlipList(newSlipList: any) {
    this.slipLists.forEach((list: any) => {
      list.crossLists.push(newSlipList)
      newSlipList.crossLists.push(list)
    })
    this.slipLists.push(newSlipList)
  }

  // connectSearchBarResults(searchResultsSlipList: any) {
  //   this.slipLists.forEach((list: any) => {
  //     list.crossLists.push(searchResultsSlipList)
  //     searchResultsSlipList.crossLists.push(list)
  //   })
  //   this.slipLists.push(searchResultsSlipList)
  // }

  syncSchedule() {
    let isGoogle: boolean = true; // Gives room later to sync to facebook instead.
    if (isGoogle) {
      let auth2 = gapi.auth2.getAuthInstance();
      let profile = auth2.currentUser.get().getBasicProfile();
      if (profile === undefined) {
        console.log("No user is logged in, syncing cancelled");
        return; 
      }

      console.log(profile.getName());
      console.log(profile.getImageUrl());
      console.log(profile.getEmail());
    }
  }

  getSemester(id: number) {
    switch (id) {
      case Semesters.Fall1:
        return this.fall1
      case Semesters.Fall2:
        return this.fall2
      case Semesters.Fall3:
        return this.fall3
      case Semesters.Fall4:
        return this.fall4
      case Semesters.Fall5:
        return this.fall5
      case Semesters.Spring1:
        return this.spring1
      case Semesters.Spring2:
        return this.spring2
      case Semesters.Spring3:
        return this.spring3
      case Semesters.Spring4:
        return this.spring4
      case Semesters.Spring5:
        return this.spring5
      default:
        throw new Error(`Semester id was not valid: ${id}`)
    }
  }

  private initAllSemesters(semesters: CourseData[][]) {
    this.fall1 = semesters[0]
    this.fall2 = semesters[1]
    this.fall3 = semesters[2]
    this.fall4 = semesters[3]
    this.fall5 = semesters[4]
    this.spring1 = semesters[5]
    this.spring2 = semesters[6]
    this.spring3 = semesters[7]
    this.spring4 = semesters[8]
    this.spring5 = semesters[9]
  }
}

export const scheduleStore = new ScheduleStore()