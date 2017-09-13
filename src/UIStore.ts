import { observable, action, computed } from 'mobx'

class UIStore {

  @observable fall5Active = false
  @observable spring5Active = false

  @observable departmentHues = new Map<string, number>()
  lastHue = 0

}

export const uiStore = new UIStore()