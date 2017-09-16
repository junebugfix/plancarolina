const fs = require('fs')

const courses = JSON.parse(fs.readFileSync('./processedCourses.json', 'utf-8'))

const filteredCourses = courses.filter(c => c.number >= 101 && c.number <= 200)

fs.writeFileSync('introCourses.json', JSON.stringify(filteredCourses, null, 2), 'utf-8')