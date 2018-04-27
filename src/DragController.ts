import { observable } from 'mobx'
import { isOverlapping, isOverlappingAndByOverHalfX, isAboveByCenter, isBelowByCenter, separate, transformDown, transformUp, getCenterPoint, Point, getOffset, Semesters } from "./utils";
import { difference } from "lodash-es";
import { scheduleStore } from "./ScheduleStore";
import { setMaxListeners, listenerCount } from "cluster";
import { uiStore } from './UIStore';

class DragController {
  @observable draggingSemester: Semesters = null
  @observable ghostIndex: Semesters = null

  isDragging = false
  dragStartSemester: Semesters
  dragStartIndex: number
  draggingElPos: Point
  draggingElHeight: number
  draggingElCenterOffset: Point
  draggingListYPositions: number[]
  draggingListBounds: ClientRect
  mutationObserver = new MutationObserver(records => records.forEach(r => this.handleMutation(r)))
  draggingEl: HTMLElement = null
  draggingList: HTMLElement
  draggingListChildren: HTMLElement[]
  dragStartPos: Point
  lists: HTMLElement[] = []
  childrenAreTransformed: boolean[] = []

  constructor() {
    document.addEventListener('mousemove', e => this.handleMousemove(e))
    document.addEventListener('touchmove', e => this.handleMousemove(e as TouchEvent))
  }

  registerDraggableList(listEl: HTMLElement) {
    for (let i = 0; i < listEl.children.length; i++) {
      const child = listEl.children[i]
      if (!child.classList.contains('undraggable')) {
        this.initDraggableChild(child as HTMLElement)
      }
    }
    if (!listEl.classList.contains('SearchBarResults')) {
      this.lists.push(listEl)
    }
    this.mutationObserver.observe(listEl, { childList: true })
  }

  private handleMousemove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return
    e.preventDefault()
    this.updateDraggingElPosition(e)
    if (this.draggingList === null || this.isPastList) {
      this.updateDraggingList()
    } else {
      this.updateGhostPosition()
    }
  }

  private getCorrectGhostIndex() {
    if (this.draggingEl === null || this.draggingList === null) return null
    const firstItemBelow = this.draggingListYPositions.findIndex(pos => pos > this.draggingElPos.y - this.draggingElHeight / 2)
    return firstItemBelow === -1 ? this.draggingListYPositions.length : firstItemBelow
  }

  private updateGhostPosition() {
    if (!this.isDragging) {
      this.ghostIndex = null
    } else {
      this.ghostIndex = this.getCorrectGhostIndex()
    }
    if (this.draggingList !== null) {
      this.updateTransforms()
    }
  }

  private updateTransforms() {
    for (let i = 0; i < this.draggingListChildren.length; i++) {
      const item = this.draggingListChildren[i]
      if (i < this.ghostIndex) {
        if (this.childrenAreTransformed[i]) {
          item.style.transform = ''
          this.childrenAreTransformed[i] = false
        }
      } else if (!this.childrenAreTransformed[i]) {
          item.style.transform = `translateY(${this.draggingElHeight}px)`
          this.childrenAreTransformed[i] = true
      }
    }
  }

  private get isPastList() {
    return this.draggingElCenter.x < this.draggingListBounds.left || this.draggingElCenter.x > this.draggingListBounds.right || this.draggingElCenter.y > this.draggingListBounds.bottom || this.draggingElCenter.y < this.draggingListBounds.top
  }

  private updateDraggingList() {
    const closestList = this.findClosestList(this.draggingEl)
    if (this.draggingList !== closestList) {
      this.draggingList = closestList
      if (closestList === null) {
        this.draggingSemester = null
        this.draggingListBounds = null
      } else {
        this.draggingSemester = Semesters[closestList.id]
        this.draggingListBounds = closestList.getBoundingClientRect()
      }
      this.updateDraggingListChildren()
    }
  }

  private updateDraggingListChildren() {
    if (this.draggingListChildren) {
      for (let i = 0; i < this.draggingListChildren.length; i++) {
        if (this.childrenAreTransformed[i]) {
          this.draggingListChildren[i].style.transform = ''
        }
      }
    }
    this.childrenAreTransformed = []
    if (this.draggingList === null) {
      this.draggingList = null
      this.draggingListYPositions = null
    } else {
      this.draggingListChildren = Array.from(this.draggingList.children).filter(el => el.classList.contains('Course') && el !== this.draggingEl) as HTMLElement[]
      this.draggingListYPositions = this.draggingListChildren.map(child => getCenterPoint(child).y)
      for (const el of this.draggingListChildren) {
        el.style.transition = 'transform 150ms ease-out'
        this.childrenAreTransformed.push(false)
      }
    }
  }

  private getClientPos(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent) {
      return { clientX: e.clientX, clientY: e.clientY }
    } else {
      const touchObj = e.changedTouches[0]
      return { clientX: touchObj.clientX, clientY: touchObj.clientY }
    }
  }

  private updateDraggingElPosition(e: MouseEvent | TouchEvent) {
    const { clientX, clientY } = this.getClientPos(e)
    this.draggingElPos = { x: clientX, y: clientY }
    const xTransform = clientX - this.dragStartPos.x
    const yTransform = clientY - this.dragStartPos.y
    this.draggingEl.style.transform = `translate(${xTransform}px, ${yTransform}px)`
  }

  private findClosestList(targetEl: HTMLElement) {
    return this.lists.find(testList => isOverlappingAndByOverHalfX(targetEl, testList)) || null
  }

  private get draggingElCenter() {
    return { x: -(this.draggingElCenterOffset.x - this.draggingElPos.x), y: -(this.draggingElCenterOffset.y - this.draggingElPos.y) }
  }

  private handleMousedown(e: MouseEvent | TouchEvent, item: HTMLElement) {
    const { clientX, clientY } = this.getClientPos(e)
    e.preventDefault()
    this.isDragging = true
    this.draggingEl = item
    this.dragStartPos = { x: clientX, y: clientY }
    const itemCenter = getCenterPoint(item)
    this.draggingElCenterOffset = { x: clientX - itemCenter.x, y: clientY - itemCenter.y }
    this.updateDraggingList()
    this.updateDraggingElPosition(e)
    this.dragStartSemester = this.draggingSemester

    const itemBounds = this.draggingEl.getBoundingClientRect()
    this.draggingElHeight = itemBounds.height
    if (this.draggingList !== null) {
      this.draggingListBounds = this.draggingList.getBoundingClientRect()
      this.draggingEl.style.position = 'absolute'
      this.draggingEl.style.width = itemBounds.width + 'px'
      this.draggingEl.style.top = (itemBounds.top - this.draggingListBounds.top) + 'px'
      this.draggingEl.style.zIndex = '99999'
    }
    
    this.updateGhostPosition()
    this.dragStartIndex = this.ghostIndex; // SEMICOLON NECESSARY
    (document.addEventListener as any)('mouseup', evt => this.handleMouseup(evt), { once: true });
    (document.addEventListener as any)('touchend', evt => this.handleMouseup(evt as TouchEvent), { once: true });
  }

  private getChildYPositions(container: HTMLElement) {
    return Array.from(container.children).map(child => getCenterPoint(child as HTMLElement).y)
  }

  private animateBack() {
    this.draggingEl.style.transition = 'transform 150ms ease-out'
    this.draggingEl.style.transform = 'translate(0px, 0px)'
    const el = this.draggingEl

    setTimeout(() => {
      el.style.position = ''
      el.style.width = ''
      el.style.top = ''
      el.style.zIndex = ''
    }, 150)

  }

  private handleMouseup(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return
    if (this.draggingSemester === null || this.ghostIndex === null) {
      this.animateBack()
    } else {
      if (this.draggingEl.classList.contains('Course')) {
        const courseId = parseInt(this.draggingEl.id.substring(7), 10)
        scheduleStore.moveCourse(this.dragStartSemester, this.dragStartIndex, this.draggingSemester, this.ghostIndex)
      } else if (this.draggingEl.classList.contains('SearchBarResults-result')) {
        const searchResultIndex = parseInt(this.draggingEl.id.substring(14), 10)
        scheduleStore.insertSearchResult(searchResultIndex, this.draggingSemester, this.ghostIndex)
      }
      for (const item of this.draggingListChildren) {
        item.style.transform = ''
      }
    }
    this.draggingEl.style.transform = 'translate(0px, 0px)'
    this.draggingEl.style.position = ''
    this.draggingEl.style.width = ''
    this.draggingEl.style.top = ''
    this.draggingEl.style.zIndex = ''
    this.isDragging = false
    this.draggingEl = null
    this.draggingElPos = null
    this.draggingList = null
    this.draggingListChildren = null
    this.draggingSemester = null
    this.ghostIndex = null
  }

  private handleMutation(record: MutationRecord) {
    const { target: list, addedNodes } = record
    for (let i = 0; i < addedNodes.length; i++) {
      const node = addedNodes[i]
      if (node instanceof HTMLElement && !node.classList.contains('undraggable')) this.initDraggableChild(node)
    }
  }

  private initDraggableChild(el: HTMLElement) {
    el.addEventListener('mousedown', e => this.handleMousedown(e, el))
    el.addEventListener('touchstart', e => this.handleMousedown(e as TouchEvent, el))
  }
}

export const dragController = new DragController()