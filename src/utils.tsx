export function getClassElements(className: string): HTMLElement[] {
  return Array.prototype.slice.call(document.getElementsByClassName(className))
}

export function getChildren(el: HTMLElement): HTMLElement[] {
  return Array.prototype.slice.call(el.children)
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
  Spring5
}
