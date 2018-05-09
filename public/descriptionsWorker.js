onmessage = function(e) {
  const obj = {}
  for (const line of e.data.split('\n')) {
    const colonIndex = line.indexOf(':')
    const id = parseInt(line.substring(0, colonIndex), 10)
    const description = line.substring(colonIndex)
    obj[id] = description
  }
  postMessage(obj)
}