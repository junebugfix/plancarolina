import { observable, action, computed } from 'mobx'

class UIStore {

  @observable fall5Active = false
  @observable spring5Active = false

}

export const uiStore = new UIStore()