import { observable, action, computed } from 'mobx'
import { Semesters } from './utils'

class UIStore {

  readonly carolinaBlue = '#4B9CD3'
  readonly lightBlue = '#BAE3F8'
  readonly lightColor = '#FFF4E1'
  readonly middleColor = '#ffc6aa'
  readonly accentColor = '#E67A7A'

  @observable fall5Active = false
  @observable spring5Active = false

  @observable departmentHues = new Map<string, number>()
  lastHue = 0

  getSemesterLabel(index: Semesters) {
    if (this.isFallSemester(index)) {
      return 'Fall'
    } else {
      return 'Spring'
    }
  }

  private isFallSemester(index: Semesters) {
    return [Semesters.Fall1, Semesters.Fall2, Semesters.Fall3, Semesters.Fall4, Semesters.Fall5].indexOf(index) !== -1
  }

}

export const uiStore = new UIStore()