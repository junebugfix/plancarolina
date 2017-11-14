import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import { uiStore } from './UIStore'
import flatten from 'lodash-es/flatten'
import * as Cookies from 'js-cookie'

export type HandleConflictResult = 'overwrite' | 'merge' | 'discard'

class LoginStore {

  @observable isLoggedIn = false
  name: string
  email: string
  previouslySavedSchedule: CourseData[][]

  fetchUserData() {
    let userToken = Cookies.get('token')
    if (!userToken) {
      uiStore.isLoadingSchedule = false
      return
    }
    let userTokenJson = {
      token: userToken
    }
    fetch('/api/api.cgi/getUserData', {
      method: 'put',
      body: JSON.stringify(userTokenJson),
      headers: {
        'Content-Type': 'application/json'
      }
    } as any).then(raw => raw.json().then(res => {
      if (!res.error) {
        this.name = res.name
        this.email = res.email
        this.isLoggedIn = true
        scheduleStore.initAllSemesters(res.schedule)
        if (flatten(res.schedule).length > 0) {
          uiStore.hasAddedACourse = true
        }
        uiStore.isLoadingSchedule = false
        uiStore.shouldPromptForLogin = false
      } else {
        console.log(res.error)
      }
    }))
  }

  @action.bound handleLoginSuccess(googleUser: any) {
    uiStore.loginPopupActive = false
    uiStore.persistentLoginAlertActive = false
    let profile = googleUser.getBasicProfile();
    if (profile === undefined) {
      console.log("No user is logged in, syncing cancelled");
      return; 
    }
    let addUserData = {
      name: profile.getName(),
      email: profile.getEmail()
    }
    fetch('/api/api.cgi/login', {
      method: 'put',
      body: JSON.stringify(addUserData),
      headers: {
        'Content-Type': 'application/json'
      }
    } as any).then(raw => raw.json().then(res => {
      this.name = googleUser.getBasicProfile().getName()
      this.email = googleUser.getBasicProfile().getEmail()
      Cookies.set('token', res.token, { expires: 365 })
      if (scheduleStore.allCourses.length > 0) {
        this.previouslySavedSchedule = res.schedule
        uiStore.promptHandleConflictPopup = true
      } else {
        scheduleStore.initAllSemesters(res.schedule)
        console.log(uiStore.isSavingSchedule)
        if (flatten(res.schedule).length > 0) {
          uiStore.hasAddedACourse = true
        }
      }
    }).then(() => {
      this.isLoggedIn = true
      uiStore.snackbarAlert(`Welcome back, ${this.name.split(' ')[0] || this.name}`)
    })).catch(err => console.log(err))
    uiStore.shouldPromptForLogin = false
  }

  handleConflictResponse(result: HandleConflictResult) {
    if (this.previouslySavedSchedule === undefined) throw new Error('previously saved schedule was undefined')
    if (result === 'overwrite') {
      scheduleStore.saveSchedule()
    } else if (result === 'merge') {
      scheduleStore.addCourses(flatten(this.previouslySavedSchedule))
    } else if (result === 'discard') {
      scheduleStore.initAllSemesters(this.previouslySavedSchedule)
    }
    uiStore.promptHandleConflictPopup = false
  }

  handleLoginFailure(e: any) {
    uiStore.snackbarAlert('Failed to login')
  }

  @action.bound logout() {
    Cookies.remove('token')
    location.reload()
    // this.isLoggedIn = false
    // if (gapi.auth2) {
    //   gapi.auth2.getAuthInstance().signOut().then(() => {
    //     console.log('user signed out')
    //   })
    // }
  }
}

export const loginStore = new LoginStore()
