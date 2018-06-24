export function getClassElements(className: string): HTMLElement[] {
  return Array.prototype.slice.call(document.getElementsByClassName(className))
}

export function getChildren(el: HTMLElement): HTMLElement[] {
  return Array.prototype.slice.call(el.children)
}

export function getObjectValues(obj: Object) {
  return Object.keys(obj).map(key => obj[key])
}

export function flatten(arr: any[], depth: number = 1) {
  for (let i = 0; i < depth; i++) {
    arr = arr.reduce((acc, val) => acc.concat(val), [])
  }
  return arr
}

export function isOverlapping(a: Element, b: Element) {
  const ab = a.getBoundingClientRect()
  const bb = b.getBoundingClientRect()
  const xOverlapping = !(ab.right < bb.left || ab.left > bb.right)
  const yOverlapping = !(ab.top > bb.bottom || ab.bottom < bb.top)
  return xOverlapping && yOverlapping
}

export function isOverlappingAndByOverHalfX(a: Element, b: Element) {
  const ab = a.getBoundingClientRect()
  const bb = b.getBoundingClientRect()
  const xOverlapping = !(ab.right < bb.left + bb.width / 2 || ab.left > bb.right - bb.width / 2)
  const yOverlapping = !(ab.top > bb.bottom || ab.bottom < bb.top)
  return xOverlapping && yOverlapping
}

export function isAboveByCenter(a: Element, b: Element) {
  const ab = a.getBoundingClientRect()
  const bb = b.getBoundingClientRect()
  const aCenterY = ab.top + ab.width / 2
  const bCenterY = bb.top + bb.width / 2
  return aCenterY < bCenterY
}

export function isBelowByCenter(a: Element, b: Element) {
  const ab = a.getBoundingClientRect()
  const bb = b.getBoundingClientRect()
  const aCenterY = ab.top + ab.width / 2
  const bCenterY = bb.top + bb.width / 2
  return aCenterY >= bCenterY
}

// like filter, but 
export function separate<T>(arr: T[], cond: (item: T) => boolean) {
  const trueArr = [], falseArr = []
  for (const item of arr) {
    if (cond(item)) trueArr.push(item)
    else falseArr.push(item)
  }
  return { passed: trueArr, failed: falseArr }
}

export function getCenterPoint(el: HTMLElement) {
  const bounds = el.getBoundingClientRect()
  return { x: bounds.left + (bounds.width / 2), y: bounds.top + (bounds.height / 2) }
}

// export function isDescendant(parent: HTMLElement, child: HTMLElement) {
//   let node = .parentNode
//   while (node !== null) {
//     if (node === parent) {
//       return true
//     }
//     node = node.parentNode
//   }
//   return false
// }

export function isChildOfClass(className: string, child: HTMLElement) {
  let node = child
  while (node !== null) {
    if (node.classList.contains(className)) {
      return true
    }
    node = node.parentElement
  }
  return false
}

export function getParentWithClass(className: string, child: HTMLElement) {
  let node = child
  while (node !== null) {
    if (node.classList.contains(className)) {
      return node
    }
    node = node.parentElement
  }
  return null
}

// export function getPosition(el: HTMLElement) {
//   var _x = 0;
//   var _y = 0;
//   while ( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
//       _x += el.offsetLeft - el.scrollLeft;
//       _y += el.offsetTop - el.scrollTop;
//       el = el.offsetParent as HTMLElement;
//   }
//   return { top: _y, left: _x };
// }

export interface Point {
  x: number,
  y: number
}

export function getOffset(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function transformUp(el: HTMLElement, amount: number) {
  el.style.transform = `translateY(-${amount}px)`
}

export function transformDown(el: HTMLElement, amount: number) {
  el.style.transform = `translateY(${amount}px)`
}

export function arrayEqual(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[0] !== arr2[0]) return false
  }
  return true
}

export function isLeftSemester(index: Semesters) {
  return [Semesters.Fall1, Semesters.Fall2, Semesters.Spring1, Semesters.Spring2, Semesters.Summer1, Semesters.Summer2].includes(index)
}

export function isRightSemester(index: Semesters) {
  return !isLeftSemester(index)
}

export function isTopSemester(index: Semesters) {
  return [Semesters.Fall1, Semesters.Fall2, Semesters.Fall3, Semesters.Fall4, Semesters.Fall5].includes(index)
}

export function isBottomSemester(index: Semesters) {
  return !isTopSemester(index)
}

export enum Semesters {
  Fall1,
  Fall2,
  Fall3,
  Fall4,
  Fall5,
  Spring1,
  Spring2,
  Spring3,
  Spring4,
  Spring5,
  Summer1,
  Summer2,
  Summer3,
  Summer4
}
