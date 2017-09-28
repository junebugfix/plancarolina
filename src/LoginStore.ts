import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import { uiStore } from './UIStore'

class LoginStore {

  @observable isLoggedIn = false

  @action.bound handleLoginSuccess(googleUser: any) {
    console.log('user logged in!')
    var profile = googleUser.getBasicProfile();

    if (profile === undefined) {
      console.log("No user is logged in, syncing cancelled");
      return; 
    }
    this.isLoggedIn = true
    uiStore.handleLogin()
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
