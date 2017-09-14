import { observable, action, computed } from 'mobx'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import Schedule from './components/Schedule'
import Semester from './components/Semester'
import { Semesters, getClassElements, getChildren } from './utils'

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
    let userData = require('./userData.json')
    this.initAllSemesters(userData.semesters)
  }

  getCourseData(id: number): CourseData {
    return this.allCourses.filter((course: CourseData) => course.id === id)[0]
  }

  getSemesterData(index: number): CourseData[] {
    let data =  this.allSemesters[index]
    return data
  }

  findSemesterWithCourse(id: number | string): CourseData[] | null {
    if (typeof id === "string") {
      id = parseInt(id, 10)
    }
    for (let i = 0; i < this.allSemesters.length; i++) {
      for (let j = 0; j < this.allSemesters[i].length; j++) {
        if (this.allSemesters[i][j].id === id) {
          return this.allSemesters[i]
        }
      }
    }
    throw new Error(`Invalid course id: ${id}`)
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
    let semesterData = this.findSemesterWithCourse(el.id) as CourseData[]
    semesterData.splice(endIndex, 0, semesterData.splice(startIndex, 1)[0])
  }

  @action.bound changeLists(fromList: HTMLElement, fromIndex: number, toList: HTMLElement, toIndex: number) {
    // let fromSemesterData = this.findSemesterWithCourse(fromList.children[0].id) as CourseData[]
    // let toSemesterData = this.findSemesterWithCourse(toList.children[0].id) as CourseData[]
    let fromSemesterData = this.getSemester(Semesters[fromList.id])
    let toSemesterData = this.getSemester(Semesters[toList.id])
    toSemesterData.splice(toIndex, 0, fromSemesterData.splice(fromIndex, 1)[0])
  }

  @action.bound addClass() {
    let semester: Semesters = Semesters.Fall2
    let courseData: CourseData = {
      id: Math.trunc(Math.random() * 1000),
      name: 'Intro to Anthropology',
      genEds: ['BN'],
      department: 'ANTH',
      number: '101'
    }
    this.fall2.push(courseData)
  }

  connectSlipList(newSlipList: any) {
    this.slipLists.forEach((list: any) => {
      list.crossLists.push(newSlipList)
      newSlipList.crossLists.push(list)
    })
    this.slipLists.push(newSlipList)
  }

  addMajor() {
    console.log('adding major')
  }

  getSemester(id: number | string) {
    if (typeof id === 'string') {
      id = Semesters[id]
    }
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