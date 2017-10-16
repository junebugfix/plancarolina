import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import { uiStore } from './UIStore'
import * as Cookies from 'js-cookie'

class LoginStore {

  @observable isLoggedIn = false
  name: string
  email: string

  constructor() {
    this.fetchUserData()
  }

  private fetchUserData() {
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
    }).then(raw => raw.json().then(res => {
      if (!res.error) {
        this.name = res.name
        this.email = res.email
        this.isLoggedIn = true
        scheduleStore.initAllSemesters(res.schedule)
        uiStore.isLoadingSchedule = false
        uiStore.shouldPromptForLogin = false
      } else {
        console.log(res.error)
      }
    }))
  }

  @action.bound handleLoginSuccess(googleUser: any) {
    uiStore.loginPopupActive = false
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
    }).then(raw => raw.json().then(res => {
      this.name = googleUser.getBasicProfile().getName()
      this.email = googleUser.getBasicProfile().getEmail()
      Cookies.set('token', res.token, { expires: 365 })
      scheduleStore.initAllSemesters(res.schedule)
    }).then(() => this.isLoggedIn = true)).catch(err => console.log(err))
    uiStore.shouldPromptForLogin = false
  }

  handleLoginFailure(e: any) {
    console.log('failure on login')
    console.log(e)
    // TODO: alert user to failure
  }

  @action.bound logout() {
    Cookies.remove('token')
    this.isLoggedIn = false
    if (gapi.auth2) {
      gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log('user signed out')
      })
    }
    location.reload()
  }
}

export const loginStore = new LoginStore()
