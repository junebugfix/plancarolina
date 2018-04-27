import * as React from 'react'
import '../styles/SearchInput.css'
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Departments } from '../departments'
// import { flatten } from 'lodash-es';
import { flatten } from '../utils'
import { uiStore } from '../UIStore';
import CourseSearch from '../CourseSearch';

@observer
export default class SearchInput extends React.Component {
  inputEl: HTMLElement
  counter = 0

  componentDidMount() {
    this.inputEl.addEventListener('input', e => {
      const input = (e.target as HTMLInputElement).value
      // uiStore.currentSearch = CourseSearch.fromString(input)
      console.log(uiStore.currentSearch)
    })
  }

  // selectEnd() {
  //   const range = document.createRange()
  //   range.selectNodeContents(this.inputEl)
  //   range.collapse(false)
  //   const selection = window.getSelection()
  //   selection.removeAllRanges()
  //   selection.addRange(range)
  // }

  render() {
    return (
      // <div ref={el => this.inputEl = el} className="SearchInput" contentEditable={true}>
      // </div>
      <input ref={el => this.inputEl = el} className="SearchInput" placeholder="Type here to search for courses..." />
    )
  }
}