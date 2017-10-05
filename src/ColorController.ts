import { uniq } from 'lodash'

class ColorController {
  readonly HUE_INTERVAL = 20
  readonly MAX_HUE = 360

  availableHues: number[] = []
  usedSearchResultHues: number[] = []
  scheduleHues = new Map<string, number>()
  searchResultHues = new Map<string, number>()

  constructor() {
    for (let i = 0; i <= this.MAX_HUE; i += this.HUE_INTERVAL) {
      this.availableHues.push(i)
    }
  }

  getSearchResultHue(dept: string) {
    if (this.scheduleHues.has(dept)) {
      return this.scheduleHues.get(dept)
    } else if (this.searchResultHues.has(dept)) {
      return this.searchResultHues.get(dept)
    }
    let tempHue = this.getAvailableHue()
    this.searchResultHues.set(dept, tempHue)
    this.usedSearchResultHues.push(tempHue)
    return tempHue
  }

  getScheduleHue(dept: string) {
    if (this.scheduleHues.has(dept)) {
      return this.scheduleHues.get(dept)
    }
    let newHue = this.getAvailableHue()
    this.scheduleHues.set(dept, newHue)
    return newHue
  }

  clearSearchResultHues() {
    this.searchResultHues.clear()
    this.availableHues = uniq(this.availableHues.concat(this.usedSearchResultHues))
    this.usedSearchResultHues = []
  }

  ensureScheduleHue(dept: string) {
    if (!this.scheduleHues.has(dept)) {
      this.scheduleHues.set(dept, this.searchResultHues.get(dept))
    }
  }

  private getAvailableHue() {
    if (this.availableHues.length === 0) {
      return this.getRandomHue()
    }
    let hueIndex = Math.floor(Math.random() * this.availableHues.length)
    return this.availableHues.splice(hueIndex, 1)[0]
  }

  private getRandomHue() {
    let totalNumAvailableHues = Math.floor(this.MAX_HUE / this.HUE_INTERVAL)
    let hue = (Math.floor(Math.random() * (totalNumAvailableHues))) * this.HUE_INTERVAL
    return hue
  }

}

export const colorController = new ColorController()