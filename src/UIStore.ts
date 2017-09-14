import { observable, action, computed } from 'mobx'

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

}

export const uiStore = new UIStore()