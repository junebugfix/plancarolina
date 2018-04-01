import { observable, action, computed, autorun } from 'mobx';
import { Departments } from './departments';
import Course, { CourseData } from './components/Course';
import { uiStore } from './UIStore';
import { loginStore } from './LoginStore';
import { colorController } from './ColorController';
import Schedule, { ScheduleData } from './components/Schedule';
import Semester from './components/Semester';
import { Semesters, getClassElements, getChildren, getObjectValues } from './utils';
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
  readonly PROMPT_LOGIN_THRESHOLD = 3

  slipLists: any[] = []
  slipListsActive: boolean = false

  getCourseData(id: number): CourseData {
    return this.allCourses.filter((course: CourseData) => course.id === id)[0]
  }

  getSemesterData(index: number): CourseData[] {
    return this[Semesters[index].toLowerCase()]
  }

  findSemesterWithCourse(courseId: number): CourseData[] {
    const semestersWithCourse = this.semestersArray.filter(s => s.filter(c => c.id === courseId).length > 0)
    if (semestersWithCourse.length === 0) throw new Error(`Invalid course id: ${courseId}`)
    if (semestersWithCourse.length > 1) throw new Error(`Course id exists twice in schedule! - ${courseId}`)
    return semestersWithCourse[0]
  }

  addCourses(rawCourses: CourseData[]) {
    const maxCoursesPerSemester = 5
    const currentCourseIds = this.allCourses.map(c => c.id)
    const availableSemesters = this.semestersToAutomaticallyAddTo
    let semesterIndex = 0
    rawCourses.forEach(course => {
      if (availableSemesters[semesterIndex].length >= maxCoursesPerSemester) {
        semesterIndex += 1
      }
      if (!this.isInSchedule(course)) {
        availableSemesters[semesterIndex % availableSemesters.length].push(course)
      }
    })
    this.saveSchedule()
  }

  isInSchedule(course: CourseData) {
    return this.allCourses.map(c => c.id).indexOf(course.id) !== -1
  }

  @computed get allCourses(): CourseData[] {
    return [].concat(...this.semestersArray.map(s => s.slice()))
    // return flatten(this.semestersArray)
  }

  @computed get semestersToAutomaticallyAddTo(): CourseData[][] {
    const result = [
      this.fall1, this.fall2, this.fall3, this.fall4,
      this.spring1, this.spring2, this.spring3, this.spring4
    ]
    if (uiStore.fall5Active) result.push(this.fall5)
    if (uiStore.spring5Active) result.push(this.spring5)
    return result
  }

  @computed get scheduleObject(): ScheduleData {
    return {
      fall1: this.fall1,
      fall2: this.fall2,
      fall3: this.fall3,
      fall4: this.fall4,
      fall5: this.fall5,
      spring1: this.spring1,
      spring2: this.spring2,
      spring3: this.spring3,
      spring4: this.spring4,
      spring5: this.spring4,
      summer1: this.summer1,
      summer2: this.summer2,
      summer3: this.summer3,
      summer4: this.summer4
    }
  }

  @computed get idScheduleObject(): ScheduleData {
    const schedule = this.scheduleObject
    for (const key in schedule) {
      schedule[key] = schedule[key].map(course => course.id)
    }
    return schedule
  }

  @computed get semestersArray(): CourseData[][] {
    return [
      this.fall1, this.fall2, this.fall3, this.fall4, this.fall5,
      this.spring1, this.spring2, this.spring3, this.spring4, this.spring5,
      this.summer1, this.summer2, this.summer3, this.summer4
    ]
  }

  @computed get summersArray(): CourseData[][] {
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
    const semesterData = this.findSemesterWithCourse(parseInt(el.id.substring(7), 10)) as CourseData[]
    semesterData.splice(endIndex, 0, semesterData.splice(startIndex, 1)[0])
    this.saveSchedule()
  }

  @action.bound changeLists(fromList: HTMLElement, fromIndex: number, toList: HTMLElement, toIndex: number) {
    const fromSemesterData = this.getSemester(Semesters[fromList.id])
    const toSemesterData = this.getSemester(Semesters[toList.id])
    toSemesterData.splice(toIndex, 0, fromSemesterData.splice(fromIndex, 1)[0])
    this.saveSchedule()
  }

  @action.bound insertSearchResult(resultIndex: number, semesterIndex: number, toIndex: number) {
    if (!uiStore.hasAddedACourse) uiStore.hasAddedACourse = true
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
    this.slipListsActive = true
    this.slipLists.forEach((list: any) => {
      list.crossLists.push(newSlipList)
      newSlipList.crossLists.push(list)
    })
    this.slipLists.push(newSlipList)
  }

  disconnectSlipLists() {
    this.slipListsActive = false
    for (const list of this.slipLists) {
      list.detach()
    }
  }

  saveSchedule() {
    if (!loginStore.isLoggedIn) return
    uiStore.isSaving = true
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
        } as any).then(res => {
          res.json().then(r => {
            uiStore.isSaving = false
          })
        }).catch(err => console.log(err))
      } else {
        if (this.allCourses.length >= this.PROMPT_LOGIN_THRESHOLD) {
          uiStore.promptUserLogin()
        }
      }
    }
    uiStore.saveSettings()
  }

  @computed get saveScheduleBody() {
    return {
      email: loginStore.email,
      schedule: JSON.stringify(this.idScheduleObject)
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

  @action.bound initAllSemesters(semesters: ScheduleData) {
    for (const semesterName in semesters) {
      this[semesterName] = semesters[semesterName]
    }
  }
}

export const scheduleStore = new ScheduleStore()