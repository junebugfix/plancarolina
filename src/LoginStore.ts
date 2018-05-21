import { observable, action, computed } from 'mobx'
import { Semesters, getObjectValues } from './utils'
import { Departments } from './departments'
import { CourseData } from './components/Course'
import { scheduleStore } from './ScheduleStore'
import { uiStore, UserSettings } from './UIStore'
// import flatten from 'lodash-es/flatten'
import { flatten } from './utils'
import * as Cookies from 'js-cookie'
import { ScheduleData } from './components/Schedule';
import { fakeUserData } from './fakeUserData';
import { uniq } from 'lodash-es';

export type HandleConflictResult = 'overwrite' | 'merge' | 'discard'

interface UserData {
  name: string,
  email: string,
  schedule: ScheduleData,
  settings: UserSettings
}

class LoginStore {
  @observable isLoggedIn = false
  @observable name: string
  @observable email: string
  previouslySavedSchedule: ScheduleData
  loginAttempts = 0
  _auth2: any
  _googleyolo: any

  offline = true

  resetLoginAttempts() {
    this.loginAttempts = 0
  }

  tryAutoLogin() {
    if (this.offline) {
      this.loadUserData(fakeUserData as UserData)
      return
    }
    const token = Cookies.get('token')
    if (token) {
      this.loginWithToken(token)
    } else {
      this.tryGoogleAutoLogin()
    }
  }

  tryGoogleAutoLogin() {
    this.googleYoloOneTapLogin().then((result: any) => {
      switch (result.type) {
        case 'success':
          this.handleLogin(result.name, result.email, result.imageUrl)
          break;
        default:
          break;
      }
    })
  }

  loginWithToken(token: string) {
    this.fetchUserDataFromToken(token).then(userData => {
      this.loadUserData(userData)
    }).catch(err => {
      if (err === 'No user exists') {
        Cookies.remove('token')
        this.tryGoogleAutoLogin()
      }
    })
  }

  loginWithGoogle() {
    uiStore.loginPopupActive = false
    this.loginAttempts++
    if (this.loginAttempts >= 3) {
      this.alertTroubleLoggingIn()
    }

    this.googleYoloOneTapLogin().then((result: any) => {
      switch (result.type) {
        case 'success':
          this.handleLogin(result.name, result.email, result.imageUrl)
          break;
        case 'noCredentialsAvailable':
          this.gapiLogin()
          break;
        case 'userCanceled':
          const canceledSnackbarOptions = {
            message: 'Didn\'t see your account?',
            action: () => this.gapiLogin(),
            actionLabel: 'Login'
          }
          uiStore.snackbarAlert(canceledSnackbarOptions)
          break;
        case 'requestFailed':
          const failedSnackbarOptions = {
            message: 'Could not connect to internet',
            action: () => this.loginWithGoogle(),
            actionLabel: 'Retry'
          }
          uiStore.snackbarAlert(failedSnackbarOptions)
          break;
        default:
          break;
      }
    })
  }

  get auth2() {
    return new Promise<any>((resolve, reject) => {
      if (this._auth2) resolve(this._auth2)
      gapi.load('auth2', () => {
        gapi.auth2.init().then(auth2 => {
          this._auth2 = auth2
          resolve(auth2)
        })
      })
    })
  }

  alertTroubleLoggingIn() {
    const dialogOptions = {
      titleText: 'Trouble signing in?',
      bodyText: 'The "Tracking protection" or "Prevent cross-site tracking" feature in some browsers disables google sign in, since they are technically "tracking" that you are logged into the site. If you can\'t sign in, please disable this feature in your browser\'s preferences and try again. Additionally, clearing your browser\'s cache and cookies may help.',
      button1Text: 'Close',
      button1Action: () => uiStore.dialog.open = false,
    }
    uiStore.showDialog(dialogOptions)
    this.resetLoginAttempts()
  }
  
  googleYoloOneTapLogin() {
    return new Promise(async (resolve, reject) => {
      const googleyolo = await this.googleyolo
      googleyolo.hint({
        supportedAuthMethods: [
          "https://accounts.google.com"
        ],
        supportedIdTokenProviders: [
          {
            uri: "https://accounts.google.com",
            clientId: "858591149551-skst1i5q4krogmu6t9dldjr3m6eu52ra.apps.googleusercontent.com"
          }
        ]
      }).then((credential) => {
        resolve({ type: 'success', name: credential.displayName, email: credential.id, imageUrl: credential.profilePicture })
      }, (error) => {
        console.log(error)
        resolve(error)
      })
    })
  }

  gapiLogin() {
    this.auth2.then(async auth2 => {
      if (auth2.isSignedIn.get()) {
        const profile = auth2.currentUser.get().getBasicProfile()
        const name = profile.getName()
        const email = profile.getEmail()
        const imageUrl = profile.getImageUrl()
        const confirmed = await this.promptConfirmUser(name, email, imageUrl)
        if (confirmed) {
          this.handleLogin(name, email, imageUrl)
          return
        }
      }
      auth2.signIn({ prompt: 'select_account' }).then((googleUser) => {
        this.signInWithGoogleUser(googleUser)
      }, (error) => console.log(error))
    })
  }

  signInWithGoogleUser(googleUser: any) {
    const profile = googleUser.getBasicProfile()
    this.handleLogin(profile.getName(), profile.getEmail(), profile.getImageUrl())
  }

  promptConfirmUser(name: string, email: string, imageUrl: string) {
    return new Promise((resolve, reject) => {
      const dialogOptions = {
        titleText: `Continue as ${name}?`,
        bodyText: `Click continue to sign in as ${name}, (${email}).`,
        button1Text: 'Continue',
        button1Action: () => resolve(true),
        button2Text: 'Use other account',
        button2Action: () => resolve(false),
        imageUrl
      }
      uiStore.showDialog(dialogOptions)
    })
  }

  get googleyolo() {
    return new Promise<any>((resolve, reject) => {
      if (this._googleyolo) {
        resolve(this._googleyolo)
      }
      window.onGoogleYoloLoad = googleyolo => {
        this._googleyolo = googleyolo
        resolve(googleyolo)
      }
    })
  }

  fetchUserDataFromToken(token: string): Promise<UserData> {
    const alertNetworkErrorWithRetry = () => uiStore.alertNetworkError(() => this.fetchUserDataFromToken(token))
    return new Promise<UserData>((resolve, reject) => {
      fetch('/api/api2.cgi/getUserData', {
        method: 'put',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json'
        }
      } as any).then(raw => raw.json().then(res => {
        if (!res.error) {
          resolve(res)
        } else {
          if (res.error !== 'No user exists') {
            alertNetworkErrorWithRetry()
          }
          reject(res.error)
        }
      }).catch(err => {
        alertNetworkErrorWithRetry()
        reject(err)
      })).catch(err => {
        alertNetworkErrorWithRetry()
        reject(err)
      })
    })
  }

  handleGoogleYoloLoaded(googleyolo: any) {
    this._googleyolo = googleyolo
  }

  @action.bound loadUserData(userData: UserData) {
    this.name = userData.name
    this.email = userData.email
    if (scheduleStore.allCourses.length > 0) {
      this.previouslySavedSchedule = userData.schedule
      uiStore.promptHandleConflictPopup = true
    } else {
      scheduleStore.initAllSemesters(userData.schedule)
      uiStore.loadSettings(userData.settings)
      if (flatten(getObjectValues(userData.schedule)).length > 0) {
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
    uiStore.loginPopupActive = false
    uiStore.persistentLoginAlertActive = false
    uiStore.snackbarAlert({ message: `Welcome back, ${givenName}` })
  }

  @action.bound handleLogin(name: string, email: string, imageUrl: string) {
    fetch('/api/api2.cgi/login', {
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
      scheduleStore.addCourses(flatten(getObjectValues(this.previouslySavedSchedule)))
    } else if (result === 'discard') {
      scheduleStore.initAllSemesters(this.previouslySavedSchedule)
    }
    uiStore.promptHandleConflictPopup = false
  }

  handleLoginFailure(e: any) {
    uiStore.snackbarAlert({ message: 'Failed to login' })
  }

  disableGoogleYoloAutoSignIn() {
    return new Promise((resolve, reject) => {
      this.googleyolo.then(googleyolo => googleyolo.disableAutoSignIn())
        .then(() => resolve())
    })
  }

  disableAuth2AutoSignIn() {
    return new Promise((resolve, reject) => {
      this.auth2.then(auth2 => {
        auth2.disconnect()
        resolve()
      })
    })
  }

  @action.bound logout() {
    Promise.all([
      this.disableGoogleYoloAutoSignIn(),
      this.disableAuth2AutoSignIn()
    ]).then(() => {
      Cookies.remove('token')
      location.reload()
    })
  }
}

export const loginStore = new LoginStore()
