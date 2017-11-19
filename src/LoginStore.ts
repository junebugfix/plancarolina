import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import { uiStore } from './UIStore'
import flatten from 'lodash-es/flatten'
import * as Cookies from 'js-cookie'

export type HandleConflictResult = 'overwrite' | 'merge' | 'discard'

interface UserData {
  name: string,
  email: string,
  schedule: CourseData[][],
  settings: string
}

class LoginStore {
  @observable isLoggedIn = false
  @observable name: string
  @observable email: string
  previouslySavedSchedule: CourseData[][]
  _googleyolo: any

  get googleyolo() {
    return new Promise<any>((resolve, reject) => {
      if (this._googleyolo) {
        resolve(this._googleyolo)
      }
      window.onGoogleYoloLoad = googleyolo => {
        resolve(googleyolo)
      }
    })
  }

  tryAutoLogin() {
    const userToken = Cookies.get('token')
    if (userToken) {
      this.fetchUserDataFromToken(userToken).then(userData => {
        this.loadUserData(userData)
      }).catch(error => {
        console.log(error)
        this.tryGoogleAutoLogin()
      })
    } else {
      this.tryGoogleAutoLogin()
    }
  }

  private tryGoogleAutoLogin() {
    this.fetchLoginFromGoogleYolo().then(loginInfo => {
      this.handleLogin(loginInfo.name, loginInfo.email)
    }).catch(err => console.log(err))
  }

  private async fetchLoginFromGoogleYolo(): Promise<{ name: string, email: string }> {
    const googleyolo = await this.googleyolo
    const googleYoloOptions = {
      supportedAuthMethods: [ 'https://accounts.google.com', 'googleyolo://id-and-password' ],
      supportedIdTokenProviders: [
        {
          uri: 'https://accounts.google.com',
          clientId: '39695730822-42pc2md5in45nhcs959grmp9g7mh8jbm.apps.googleusercontent.com'
        }
      ]
    }
    return new Promise<{ name: string, email: string }>((resolve, reject) => {
      googleyolo.retrieve(googleYoloOptions).then(credential => {
        console.log('automatically logged in with googleyolo!')
        resolve({ name: credential.displayName, email: credential.id })
      }).catch(error => {
        if (error.type === 'noCredentialsAvailable') {
          googleyolo.hint(googleYoloOptions).then(credential => {
            if (credential.authMethod === 'https://accounts.google.com') {
              console.log('automatically logged in from hint with googleyolo!')
              resolve({ name: credential.displayName, email: credential.id })
            }
          }).catch(err => reject(err))
        } else {
          reject(error)
        }
      })
    })
  }

  fetchUserDataFromToken(token: string): Promise<UserData> {
    return new Promise<UserData>((resolve, reject) => {
      fetch('/api/api.cgi/getUserData', {
        method: 'put',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json'
        }
      } as any).then(raw => raw.json().then(res => {
        if (!res.error) {
          resolve(res)
        } else {
          reject(res.error)
        }
      })).catch(err => reject(err))
    })
  }

  handleGoogleYoloLoaded(googleyolo: any) {
    this._googleyolo = googleyolo
  }

  @action.bound handleGoogleLoginSuccess(googleUser: any) {
    const name = googleUser.getBasicProfile().getName()
    const email = googleUser.getBasicProfile().getEmail()
    this.handleLogin(name, email)
  }

  @action.bound loadUserData(userData: UserData) {
    this.name = userData.name
    this.email = userData.email
    if (scheduleStore.allCourses.length > 0) {
      this.previouslySavedSchedule = userData.schedule
      uiStore.promptHandleConflictPopup = true
    } else {
      scheduleStore.initAllSemesters(userData.schedule)
      if (flatten(userData.schedule).length > 0) {
        uiStore.hasAddedACourse = true
      }
    }
    let givenName = userData.name
    const firstPart = userData.name.split(' ')[0]
    if (!firstPart.includes('.')) {
      givenName = firstPart
    }
    this.isLoggedIn = true
    uiStore.shouldPromptForLogin = false
    uiStore.isLoadingSchedule = false
    uiStore.loginPopupActive = false
    uiStore.persistentLoginAlertActive = false
    uiStore.snackbarAlert(`Welcome back, ${givenName}`)
  }

  @action.bound handleLogin(name: string, email: string) {
    console.log(`handling login with name: ${name} and email: ${email}`)
    fetch('/api/api.cgi/login', {
      method: 'put',
      body: JSON.stringify({ name, email }),
      headers: {
        'Content-Type': 'application/json'
      }
    } as any).then(raw => raw.json().then(res => {
      Cookies.set('token', res.token, { expires: 365 })
      const userData = {
        name,
        email,
        schedule: res.schedule,
        settings: res.settings
      }
      this.loadUserData(userData)
    })).catch(err => console.log(err))
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
  }
}

export const loginStore = new LoginStore()
