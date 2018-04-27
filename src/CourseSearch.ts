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
  department: Departments
  courseNumber: number
  operator: Operator
  geneds: Gened[] = []
  keywords: string

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