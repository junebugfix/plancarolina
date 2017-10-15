import * as React from 'react'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import { CourseData } from './Course'
import "../styles/AlertPopup.css"

export default class AddClassPopup extends React.Component {

  render() {
    return (
    <div>
      <div id="popup1" className="overlay">
        <div className="popup">
          <h2>Add Class</h2>
          <a className="close" href="#" onClick={uiStore.handleCloseAddClass}>&times;</a>
          <br></br>
          <div className="content add-class">
            <form>
              <h6>Class Department (ex. COMP)</h6><input type='text' id="add-major-class-department"/>
              <h6>Class number (ex. 110)</h6><input type='number' id="add-major-class-number"/>
              <h6>Class name (ex. Introduction to Programming)</h6><input type='text' id="add-major-class-name"/>
              <h6>Credit hours (ex. 3)</h6><input type='number' id="add-major-class-hours"/>
              <h6>Gen eds? (ex. EE, GL, NA, HS)</h6><input type='text' id="add-major-class-geneds"/>
              <button onClick={() => this.addClass()}>Add class</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  }

  addClass() {
    let department: HTMLInputElement = document.getElementById("add-major-class-department") as HTMLInputElement
    let classNumber: HTMLInputElement = document.getElementById("add-major-class-number") as HTMLInputElement
    let name: HTMLInputElement = document.getElementById("add-major-class-name") as HTMLInputElement
    let hours: HTMLInputElement = document.getElementById("add-major-class-hours") as HTMLInputElement
    let geneds: HTMLInputElement = document.getElementById("add-major-class-geneds") as HTMLInputElement

    let course: CourseData = {
      name: name.value, 
      department: department.value,
      description: department.value + classNumber.value + ": " + name.value,
      number: classNumber.value,
      credits: +hours.value,
      geneds: [geneds.value],
      id: Math.random() * 50000
    }

    scheduleStore.addCourses([course]);
    uiStore.addClassPopupActive = false;
  }
}

// addCourses(rawCourses: CourseData[]) {
//   const semesterLimit = 5
//   let courses = rawCourses.filter(c => c.id) // remove error: not found items
//   let semesterIndex = 0
//   courses.forEach(course => {
//     if (this.getSemester(semesterIndex).length > semesterLimit - 1 || semesterLimit > this.allSemesters.length - 1) {
//       semesterIndex += 1
//     }
//     this.getSemester(semesterIndex % this.allSemesters.length).push(course)
//   })
// }

// export type CourseData = {
//   id: number,
//   department: string,
//   number: string
//   name: string,
//   credits: number,
//   geneds: string[],
//   description: string,
// }