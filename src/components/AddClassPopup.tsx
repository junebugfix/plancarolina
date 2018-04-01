import * as React from 'react'
import { observable, action } from 'mobx'
import { uiStore } from '../UIStore'
import { scheduleStore } from '../ScheduleStore'
import { loginStore } from '../LoginStore'
import { CourseData } from './Course'
import "../styles/AlertPopup.css"

export default class AddClassPopup extends React.Component {
  courseOffset: number = 0;

  render() {
    return (
    <div>
      <div id="popup1" className="overlay">
        <div className="popup">
          <h2>Add Class</h2>
          <a className="close" href="#" onClick={() => uiStore.addClassPopupActive = false}>&times;</a>
          <br/>
          <div className="content add-class">
            <div>
              <h6>Class Department (ex. COMP)</h6><input type='text' id="add-major-class-department"/>
              <h6>Class number (ex. 110)</h6><input type='number' id="add-major-class-number"/>
              <h6>Class name (ex. Introduction to Programming)</h6><input type='text' id="add-major-class-name"/>
              <h6>Credit hours (ex. 3)</h6><input type='number' id="add-major-class-hours"/>
              <h6>Gen eds? (ex. EE, GL, NA, HS)</h6><input type='text' id="add-major-class-geneds"/>
              <button id='submit-add-class' onClick={() => this.addClass()}>Submit class</button>
            </div>
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
      department: department.value,
      number: Number(classNumber.value),
      modifier: "",
      name: name.value, 
      credits: +hours.value,
      geneds: [geneds.value],
      description: department.value + classNumber.value + ": " + name.value,
      id: 99999
    }

    let userId: number
    let uidString: string = 'uid'

    fetch('api/api.cgi/getUserId/' + loginStore.email, {
      method: 'get',
      headers: {
        'Content-Type': 'text'
      }
    } as any).then(raw => raw.json().then(res => {
      userId = +res[uidString]
    }))

    let userDefinedCourse = {
      cid: 99999,
      department: department.value,
      cnumber: Number(classNumber.value),
      modifier: "",
      cname: name.value,
      credits: +hours.value,
      geneds: [geneds.value].toString(),
      description: department.value + classNumber.value + ": " + name.value,
      uid: userId
    }

    fetch('/api/api.cgi/addUserDefinedCourse', {
      method: 'put',
      body: JSON.stringify(userDefinedCourse),
      headers: {
        'Content-Type': 'application/json'
      }
    } as any).then(raw => raw.json().then(res => {
      scheduleStore.addCourses([course])
      this.courseOffset++
    }).then().catch(err => console.log(err)))
    uiStore.addClassPopupActive = false
  }
}