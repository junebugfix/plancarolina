import { Departments, DEPARTMENT_NAMES } from "./departments"
import { uiStore } from "./UIStore"
import CourseSearch, { ALL_DEPARTMENTS } from "./CourseSearch"
import { CourseData } from "./components/Course";
import SearchBarResults from "./components/SearchBarResults";

class CoursesStore {
  _courses: CourseData[]
  descriptions: { [id: number]: string } = {}
  searchBarResults: SearchBarResults

  readonly COURSES_NOT_LOADED_ERROR = 'Courses not loaded'

  getDescriptions(ids: number[]) {
    const idsToGet = ids.filter(id => !(id in this.descriptions))
    return new Promise((resolve, reject) => {
      fetch('/api/api2.cgi/descriptions', {
        method: 'put',
        body: JSON.stringify({ ids: idsToGet }),
        headers: { 'Content-Type': 'application/json' }
      } as any).then(raw => raw.json().then(res => {
        for (const pair of res.results) {
          const id = pair[0]
          const desc = pair[1]
          this.descriptions[id] = desc
          uiStore.handleDescriptionLoaded(id, desc)
        }
        resolve()
      }).then().catch(err => reject(err)))
    })
  }

  makeCourseWithDescription(data: CourseData, description: string): CourseData {
    data.description = description
    return data
  }

  private matchesDepartment(c: CourseData, s: CourseSearch) {
    if (!s.department) return true
    return Departments[c.department] === s.department
  }

  private matchesCourseNumber(c: CourseData, s: CourseSearch) {
    if (!s.courseNumber) return true
    switch (s.operator) {
      case '=':
        return c.courseNumber === s.courseNumber
      case '<=':
        return c.courseNumber <= s.courseNumber
      case '>=':
        return c.courseNumber >= s.courseNumber
      case 'begins':
        return c.courseNumber.toString().startsWith(s.courseNumber.toString())
      default:
        throw new Error(`invalid operator: ${s.operator}`)
    }
  }

  private matchesGeneds(c: CourseData, s: CourseSearch) {
    if (!s.geneds || s.geneds.length === 0) return true
    for (const gened of s.geneds) {
      if (!c.geneds.includes(gened)) return false
    }
    return true
  }

  private matchesKeywords(c: CourseData, s: CourseSearch) {
    if (!s.keywords) return true
    for (const word of s.keywords.split(' ')) {
      if (c.name.toLowerCase().indexOf(word.toLowerCase()) === -1) return false
    }
    return true
  }
  
  private matchesSearch(c: CourseData, s: CourseSearch) {
    return this.matchesDepartment(c, s) && this.matchesCourseNumber(c, s) && this.matchesGeneds(c, s) && this.matchesKeywords(c, s)
  }

  private scoreName(c: CourseData, s: CourseSearch) {
    let score = 0
    for (const word of s.keywords.split(' ')) {
      const wordIndex = c.name.toLowerCase().indexOf(word.toLowerCase())
      const nameLength = c.name.length
      score += (nameLength - wordIndex) / nameLength
    }
    return score
  }

  search(s: CourseSearch) {
    return new Promise<CourseData[]>((resolve, reject) => {
      console.time('search')
      if (!this._courses) {
        reject(this.COURSES_NOT_LOADED_ERROR)
      } else {
        // if there are no keywords, just filter by match
        // these will already be sorted by department and number
        if (!s.keywords) resolve(this._courses.filter(c => this.matchesSearch(c, s)).slice(0, 200))
        // else, filter by match and assign a score based on the keyword
        // sort by that score, and return the first n results
        const matches = []
        for (const c of this._courses) {
          if (this.matchesSearch(c, s)) {
            matches.push({
              course: c,
              score: this.scoreName(c, s)
            })
          }
        }
        const sorted = matches.sort((a: any, b: any) => b.score - a.score)
        const finalResults = sorted.slice(0, 200).map(obj => obj.course)
        resolve(finalResults)
        console.timeEnd('search')
      }
    })
  }

  set courses(data: any) {
    this._courses = data
    uiStore.handleCoursesLoaded()
  }

  downloadCoursesWithoutDescriptions() {
    fetch('nodesc.txt').then(raw => raw.text().then(res => {
      this.parseCourses(res)
    }))
  }

  private parseCourses(text: string) {
    if ((window as any).Worker) {
      this.parseWithWorker(text)
    } else {
      this.parseWithoutWorker(text)
    }
  }

  private parseWithWorker(text: string) {
    const worker = new Worker('parseWorker.js')
    worker.onmessage = e => {
      this.courses = e.data
    }
    worker.postMessage(text)
  }

  private parseWithoutWorker(text: string) {
    const courses = []
    for (const line of text.split('\n')) {
      if (line === '') continue
      const tokens = line.split('|')
      courses.push({
        id: parseInt(tokens[0], 10),
        department: tokens[1],
        courseNumber: parseInt(tokens[2], 10),
        modifier: tokens[3],
        name: tokens[4],
        credits: parseInt(tokens[5], 10),
        geneds: tokens[6] === '' ? [] : tokens[6].split(','),
      })
    }
    this.courses = courses
  }
}

export const coursesStore = new CoursesStore()