onmessage = function(e) {
  const courses = []
  for (const line of e.data.split('\n')) {
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
  postMessage(courses)
}