import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import SearchResults from './SearchResults'
import '../styles/SearchBar.css'
import 'tags-input/tags-input.css'

@observer
export default class SearchBar extends React.Component {

  componentDidMount() {
    const tagsInput = require('tags-input')
    let genedInput = document.getElementById('gened-input') as HTMLInputElement
    tagsInput(genedInput)
    // the input-tags script takes away the onchange handler if you add it in the render function below
    genedInput.onchange = uiStore.handleGenedAdded
    uiStore.registerDepartmentInput(document.getElementById('department-input') as HTMLInputElement)
  }

  render() {
    return (
      <div className="SearchBar">
        <h2>Search for courses</h2>
        <div id="department-number-group">
          <input placeholder="COMP" id="department-input" onChange={uiStore.handleSearchingDepartmentChange} />
          {uiStore.isSearchingDepartment && <SearchResults label="dept-res" items={uiStore.departmentResults} />}
          <select onChange={uiStore.handleNumberOperatorChange}>
            <option value="=">=</option>
            <option value=">=">≥</option>
            <option value="<=">≤</option>
          </select>
          <input placeholder="110" id="number-input" onChange={uiStore.handleSearchingNumber} />
        </div>
        <div id="name-gened-group">
          <label htmlFor="name-input">Name/Keywords:</label>
          <input id="name-input" placeholder="Intro to Programming" onChange={uiStore.handleSearchingName} />
          <br />
          <label htmlFor="gened-input">Gen Eds:</label>
          <input type="tags" placeholder="QR" id="gened-input" />
        </div>
        <div className="SearchBar-results"></div>
      </div>
    )
  }
}