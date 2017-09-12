import { observable, action, computed } from 'mobx'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import Schedule from './components/Schedule'
import Semester, { Semesters } from './components/Semester'
import { getClassElements, getChildren } from './utils'

interface UserData {
  name: string,
  fall5active: boolean,
  spring5active: boolean,
  semesters: CourseData[][]
}

export default class Store {

  userData: UserData
  schedule: Schedule

  constructor() {
    this.userData = require('./userData.json')
  }

  registerSchedule(schedule: Schedule) {
    this.schedule = schedule
  }

  updateSemester(semesterDiv: HTMLDivElement) {
    let semesterIndex = Semesters[semesterDiv.id]
    console.log(this.userData.semesters[semesterIndex])
    let allCourses = this.getAllCourses()
    let oldSemesterData = this.getSemesterData(semesterIndex)
    let newCourseIds: number[] = getChildren(semesterDiv).map((courseDiv: HTMLDivElement) => parseInt(courseDiv.id, 10))
    let newSemesterData = newCourseIds.map((id: number) => this.getCourseData(id))
    this.userData.semesters[semesterIndex] = newSemesterData
    console.log(this.userData.semesters[semesterIndex])
  }

  getCourseData(id: number): CourseData {
    return this.getAllCourses().filter((course: CourseData) => course.id === id)[0]
  }

  getSemesterData(id: number): CourseData[] {
    return this.userData.semesters[id]
  }

  getAllCourses(): CourseData[] {
    return this.userData.semesters.reduce((prev: CourseData[], curr: CourseData[]) => prev.concat(curr), [])
  }

  addClass() {
    let semester: Semesters = Semesters.Fall2
    let courseData: CourseData = {
      id: 12,
      name: 'Intro to Anthropology',
      genEds: ['BN'],
      department: 'ANTH',
      number: '101'
    }
    // this.schedule.addClass(semester, courseData);
  }

  addMajor() {
    console.log('adding major')
  }

  // getSemesterData(semesterId: SemesterId) {
    // return this.semesters[semesterIdToIndex(semesterId)]
  // }
}

export const store = new Store()