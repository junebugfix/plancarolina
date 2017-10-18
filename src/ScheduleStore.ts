import { observable, action, computed, autorun } from 'mobx';
import { Departments } from './departments';
import { CourseData } from './components/Course';
import { uiStore } from './UIStore';
import { loginStore } from './LoginStore';
import { promptUserLogin } from './components/AlertPopup'
import { colorController } from './ColorController';
import Schedule from './components/Schedule';
import Semester from './components/Semester';
import { Semesters, getClassElements, getChildren } from './utils';
import difference from 'lodash-es/difference';
import flatten from 'lodash-es/flatten';

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
  @observable summer1: CourseData[] = []
  @observable summer2: CourseData[] = []
  @observable summer3: CourseData[] = []
  @observable summer4: CourseData[] = []

  @observable majorCoursesNeeded: string[] = ['hi', 'hello', 'merhaba']
  readonly GENEDS_NEEDED = ["CR", "FL", "QR", "LF", "PX", "PX", "PL", "HS", "SS", "SS", "VP", "LA", "PH", "BN", "CI", "EE", "GL", "NA", "QI", "US", "WB"]
  readonly CREDITS_NEEDED = 120

  slipLists: any[] = []

  getCourseData(id: number): CourseData {
    return this.allCourses.filter((course: CourseData) => course.id === id)[0]
  }

  getSemesterData(index: number): CourseData[] {
    return this.allSemesters[index]
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
    let courses = difference(rawCourses, this.allCourses)
    let semesterIndex = 0
    courses.forEach(course => {
      if (this.getSemester(semesterIndex).length > semesterLimit - 1 || semesterLimit > this.allSemesters.length - 1) {
        semesterIndex += 1
      }
      this.getSemester(semesterIndex % this.allSemesters.length).push(course)
    })
    this.saveSchedule()
  }

  @computed get allCourses(): CourseData[] {
    return [].concat(...this.allSemesters.map(s => s.slice()))
  }

  @computed get allSemesters(): CourseData[][] {
    return [
      this.fall1, this.fall2, this.fall3, this.fall4, this.fall5,
      this.spring1, this.spring2, this.spring3, this.spring4, this.spring5,
      this.summer1, this.summer2, this.summer3, this.summer4
    ]
  }

  @computed get allSummers(): CourseData[][] {
    return [this.summer1, this.summer2, this.summer3, this.summer4]
  }

  @computed get genedsFulfilled() {
    return difference(this.GENEDS_NEEDED, this.genedsRemaining)
  }

  @computed get genedsRemaining() {
    let genedsInSchedule = flatten(this.allCourses.map(c => c.geneds.slice()))
    return difference(this.GENEDS_NEEDED, genedsInSchedule)
  }

  @computed get majorCoursesFulfilled() {
    return ['hi']
  }

  @computed get majorCoursesRemaining() {
    return difference(this.majorCoursesNeeded, this.majorCoursesFulfilled)
  }

  @computed get creditsFulfilled() {
    return this.allCourses.reduce((prev, curr) => prev + (Number.isInteger(curr.credits) ? curr.credits : 0), 0)
  }

  @action.bound reorderInList(el: HTMLElement, startIndex: number, endIndex: number) {
    let semesterData = this.findSemesterWithCourse(parseInt(el.id.substring(7), 10)) as CourseData[]
    semesterData.splice(endIndex, 0, semesterData.splice(startIndex, 1)[0])
    this.saveSchedule()
  }

  @action.bound changeLists(fromList: HTMLElement, fromIndex: number, toList: HTMLElement, toIndex: number) {
    let fromSemesterData = this.getSemester(Semesters[fromList.id])
    let toSemesterData = this.getSemester(Semesters[toList.id])
    toSemesterData.splice(toIndex, 0, fromSemesterData.splice(fromIndex, 1)[0])
    this.saveSchedule()
  }

  @action.bound insertSearchResult(resultIndex: number, semesterIndex: number, toIndex: number) {
    const department = uiStore.searchResults[resultIndex].department
    colorController.ensureScheduleHue(department)
    this.getSemester(semesterIndex).splice(toIndex, 0, uiStore.searchResults.splice(resultIndex, 1)[0])
    this.saveSchedule()
  }

  @action.bound removeCourseFromSemester(courseIndex: number, semesterIndex: Semesters) {
    let department = this.getSemester(semesterIndex)[courseIndex].department
    this.getSemester(semesterIndex).splice(courseIndex, 1)
    this.saveSchedule()
  }

  connectSlipList(newSlipList: any) {
    this.slipLists.forEach((list: any) => {
      list.crossLists.push(newSlipList)
      newSlipList.crossLists.push(list)
    })
    this.slipLists.push(newSlipList)
  }

  saveSchedule() {
    uiStore.isSavingSchedule = true
    let isGoogle: boolean = true; // Gives room later to sync to facebook instead.
    if (isGoogle) {
      if (loginStore.isLoggedIn) {
        let email = loginStore.email
        fetch('/api/api.cgi/saveUserSchedule', {
          method: 'put',
          body: JSON.stringify(this.saveScheduleBody),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          res.json().then(r => {
            console.log('synced schedule!')
            uiStore.isSavingSchedule = false
          })
        }).catch(err => console.log(err))
      } else {
        if (this.allCourses.length >= 5) {
          promptUserLogin()
        }
      }
    }
  }

  get saveScheduleBody() {
    return {
      email: loginStore.email,
      schedule: JSON.stringify(this.compactScheduleJson)
    }
  }

  get compactScheduleJson() {
    return {
      schedule: this.allSemesters.map(semester => {
        return semester.map(course => course.id)
      })
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
      case Semesters.Summer1:
        return this.summer1
      case Semesters.Summer2:
        return this.summer2
      case Semesters.Summer3:
        return this.summer3
      case Semesters.Summer4:
        return this.summer4
      default:
        throw new Error(`Semester id was not valid: ${id}`)
    }
  }

  @action.bound initAllSemesters(semesters: CourseData[][]) {
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