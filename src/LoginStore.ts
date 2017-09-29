import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import { uiStore } from './UIStore'

class LoginStore {

  @observable isLoggedIn = false

  @action.bound handleLoginSuccess(googleUser: any) {
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
      scheduleStore.initAllSemesters(res.schedule)
    }).then(() => this.isLoggedIn = true)).catch(err => console.log(err))
  }

  get email() {
    return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()
  }

  get name() {
    return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()
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
