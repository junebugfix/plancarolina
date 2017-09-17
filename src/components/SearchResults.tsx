import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import '../styles/SearchResults.css'

@observer
export default class SearchResults extends React.Component<{ label: string, items: string[] }, {}> {

  counter = 0
  divEl: HTMLDivElement

  componentDidMount() {
    this.selectFirstElement()
    this.addEventListeners()
  }

  componentDidUpdate() {
    this.selectFirstElement()
  }

  selectFirstElement() {
    if (this.divEl.children.length > 0) {
      this.divEl.children[0].classList.add('selected')
    }
  }

  componentWillUnmount() {
    this.removeEventListeners()
  }

  addEventListeners() {
    document.body.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.body.addEventListener('click', this.handleClick.bind(this))
  }

  removeEventListeners() {
    document.body.removeEventListener('keydown', this.handleKeyDown.bind(this))
    document.body.addEventListener('click', this.handleClick.bind(this))
  }

  handleClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('SearchResults-item')) {
      uiStore.handleDepartmentResultChosen((e.target as HTMLDivElement).innerText)
    }
  }

  // TODO: make this better
  handleKeyDown(e: KeyboardEvent) {
    if (!this.divEl || this.divEl.children.length === 0) {
      return
    }
    let results = this.divEl.children
    let selectedIndex = -1
    for (let i = 0; i < results.length; i++) {
      if (results[i].classList.contains('selected')) {
        selectedIndex = i
      }
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (selectedIndex >= 0) {
        results[selectedIndex].classList.remove('selected')
      }
      let nextIndex = e.key === 'ArrowDown' ? selectedIndex + 1 : selectedIndex - 1
      if (selectedIndex === results.length - 1 && e.key === 'ArrowDown') {
        results[0].classList.add('selected')
        selectedIndex = 0
      } else if (selectedIndex === 0 && e.key === 'ArrowUp') {
        results[selectedIndex].classList.add('selected')
        return
      } else {
        results[nextIndex].classList.add('selected')
        selectedIndex = nextIndex
      }
    } else if (e.key === 'Enter') {
      uiStore.handleDepartmentResultChosen((results[selectedIndex] as HTMLDivElement).innerText)
    }
  }

  render() {
    return (
      <div ref={(input) => {this.divEl = input as HTMLDivElement}} className="SearchResults" >
        {this.props.items.map(item => <div key={`${this.props.label}-${this.counter++}`} className="SearchResults-item" >{item}</div>)}
      </div>
    )
  }
}