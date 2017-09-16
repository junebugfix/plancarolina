let fs = require('fs')

let courses = require('./courses.json')
courses.forEach(course => {
  course.geneds = processGeneds(course.geneds)
  course.name = processName(course.description)
  course.description - cleanDescription(course.description)
  if (course.number === 110 && course.department === 'COMP') {
    console.log('found comp 110')
    console.log(course)
  }
})

fs.writeFileSync('processedCourses.json', JSON.stringify(courses, null, 2), 'utf-8')

function processGeneds(str) {
  if (str.length === 0) return []
  return str.substring(0, str.length - 2).split(', ')
}

function processName(desc) {
  return desc.substring(0, desc.indexOf('.'))
}

function cleanDescription(desc) {
  return desc.substring(desc.indexOf('.') + 1)
}