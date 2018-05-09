import { Departments } from "./departments";

export type Operator = "=" | "<=" | ">="
export type Gened = "CR" | "FL" | "QR" | "LF" | "PX" | "PL" | "HS" | "SS" | "VP" | "LA" | "PH" | "BN" | "CI" | "EE" | "GL" | "NA" | "QI" | "US" | "WB"
export const ALL_GENEDS = ["CR", "FL", "QR", "LF", "PX", "PL", "HS", "SS", "VP", "LA", "PH", "BN", "CI", "EE", "GL", "NA", "QI", "US", "WB"]

function getAllDepartments() {
  const depts = []
  for (const enumKey in Departments) {
    const isTextKey = !(parseInt(enumKey, 10) >= 0)
    if (isTextKey) {
      depts.push(enumKey)
    }
  }
  return depts
}

export const ALL_DEPARTMENTS = getAllDepartments()

export default class CourseSearch {
  static fromString(s: string): CourseSearch {
    const search = new CourseSearch()
    for (const word of s.split(' ')) {
      if (ALL_DEPARTMENTS.includes(word)) {
        search.department = Departments[word]
      } else if (this.isCourseNumber(word)) {
        search.courseNumber = parseInt(word, 10)
      } else {
        search.keywords = search.keywords === undefined ? word : search.keywords + ' ' + word
      }
    }
    return search
  }

  static isCourseNumber(s: string) {
    const intVal = parseInt(s, 10)
    return intVal > 0 && intVal < 1000
  }

  department: Departments
  courseNumber: number
  operator: Operator
  geneds: Gened[] = []
  keywords: string

  isEmpty() {
    return this.department === undefined && this.courseNumber === undefined && this.geneds.length === 0 && (this.keywords === undefined || this.keywords === '')
  }

  get url() {
    const genedsQuery = this.geneds.length === 0 ? 'none' : this.geneds.join(',')
    const keywordsQuery = !this.keywords || this.keywords === '' ? 'none' : this.keywords
    const deptQuery = this.department ? Departments[this.department] : 'none'
    let operatorQuery = 'eq'
    if (this.operator === '<=') operatorQuery = 'lt'
    else if (this.operator === '>=') operatorQuery = 'gt'
    return `/api/api2.cgi/search/${deptQuery}/${operatorQuery}/${this.courseNumber || 'none'}/${keywordsQuery}/${genedsQuery}`
  }
}