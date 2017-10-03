import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import { uiStore } from './UIStore'

class LoginStore {

  @observable isLoggedIn = false
  Cookie: any
  name: string
  email: string

  constructor() {
    this.Cookie = require('cookie.js')
    let userToken = this.Cookie.get('token')
    let userTokenJson = {
      token: userToken
    }
    console.log(userTokenJson)
    fetch('/api/api.cgi/getUserData', {
      method: 'put',
      body: JSON.stringify(userTokenJson),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(raw => raw.json().then(res => {
      if (!res.error) {
        console.log('I remembered you!')
        console.log(res)
        this.name = res.name
        this.email = res.email
        scheduleStore.initAllSemesters(res.schedule)
        this.isLoggedIn = true
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
      console.log(res)
      this.name = googleUser.get().getBasicProfile().getName()
      this.email = googleUser.get().getBasicProfile().getEmail()
      this.Cookie.set('token', res.token)
      scheduleStore.initAllSemesters(res.schedule)
    }).then(() => this.isLoggedIn = true)).catch(err => console.log(err))
  }

  handleLoginFailure(e: any) {
    console.log('failure on login')
    console.log(e)
  }

  @action.bound logout() {
    this.isLoggedIn = false
    gapi.auth2.getAuthInstance().signOut().then(() => {
      console.log('user signed out')
    })
  }
}

export const loginStore = new LoginStore()
