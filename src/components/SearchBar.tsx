import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import SearchResults from './SearchResults'
import SearchBarResults from './SearchBarResults'
import AddClassPopup from './AddClassPopup'
import '../styles/SearchBar.css'
import 'tags-input/tags-input.css'

@observer
export default class SearchBar extends React.Component {

  componentDidMount() {
    const tagsInput = require('tags-input')
    let genedInput = document.getElementById('gened-input') as HTMLInputElement
    tagsInput(genedInput)
    // the input-tags script takes away the onchange handler if you add it in the render function below
    genedInput.onchange = uiStore.handleGenedChanged
    uiStore.registerDepartmentInput(document.getElementById('department-input') as HTMLInputElement)
  }

  render() {
    return (
      <div className="SearchBar">
        <div id="searchbar-search-group" >
          <h2>Search for courses</h2>
          <div className="loader-container">
            {uiStore.isLoadingSearchResults && <div className="loader"></div>}
          </div>
          <div id="department-number-group">
            <input placeholder="COMP" id="department-input" onChange={uiStore.handleSearchingDepartmentChange} />
            {uiStore.isSearchingDepartment && <SearchResults label={uiStore.DEPARTMENT_LABEL} items={uiStore.departmentResults} />}
            <select onChange={uiStore.handleNumberOperatorChange}>
              <option value="eq">=</option>
              <option value="gt">≥</option>
              <option value="lt">≤</option>
            </select>
            <input placeholder="110" id="number-input" onChange={uiStore.handleSearchingNumber} />
          </div>
          <div id="name-gened-group">
            <input id="name-input" placeholder="Name: Intro to Programming" onChange={uiStore.handleSearchingKeywords} />
            <br />
            <input type="tags" placeholder="Gen Eds: QR" id="gened-input" />
          </div>
        </div>
        <SearchBarResults />
        <button id='searchbar-add-class' onClick={() => {uiStore.addClassPopupActive = true}}>Don't see your class? Click here</button>
        {uiStore.addClassPopupActive && <AddClassPopup />}
      </div>
    )
  }
}