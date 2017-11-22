import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import SearchResults from './SearchResults'
import SearchBarResults from './SearchBarResults'
import AddClassPopup from './AddClassPopup'
import Spinner from './Spinner';
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
            {uiStore.isLoadingSearchResults && <Spinner />}
          </div>
          <div className="first-row-container">
            <input placeholder="COMP" id="department-input" onChange={uiStore.handleSearchingDepartmentChange} />
            {uiStore.isSearchingDepartment && <SearchResults label={uiStore.DEPARTMENT_LABEL} items={uiStore.departmentResults} />}
            <div id="custom-select">
              <select onChange={uiStore.handleNumberOperatorChange}>
                <option value="eq">=</option>
                <option value="gt">≥</option>
                <option value="lt">≤</option>
              </select>
            </div>
            <input placeholder="110" id="number-input" onChange={uiStore.handleSearchingNumber} />
            <input type="tags" placeholder="Gen Eds: QR" id="gened-input" />
          </div>
          <input id="name-input" placeholder="Name: Intro to Programming" onChange={uiStore.handleSearchingKeywords} />
        </div>
        <div className="search-bar-results-container">
          <SearchBarResults />
        </div>
        {<button id='searchbar-add-class' onClick={() => {uiStore.addClassPopupActive = true}}>Don't see your class?{!uiStore.isMobileView && ' Click here'}</button>}
        {uiStore.addClassPopupActive && <AddClassPopup />}
      </div>
    )
  }
}