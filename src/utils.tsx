export function getClassElements(className: string): HTMLElement[] {
  return Array.prototype.slice.call(document.getElementsByClassName(className))
}

export function getChildren(el: HTMLElement): HTMLElement[] {
  return Array.prototype.slice.call(el.children)
}