import * as React from 'react'
import { observable, action, autorun } from 'mobx'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import SearchResults from './SearchResults'
import SearchBarResults from './SearchBarResults'
import AddClassPopup from './AddClassPopup'
import Spinner from './Spinner'
import TagsInput from './TagsInput'
import AutocompleteInput from './AutocompleteInput'
import CourseSearch, { ALL_GENEDS, ALL_DEPARTMENTS, Operator, Gened } from '../CourseSearch';
import { DEPARTMENT_NAMES, Departments } from '../departments';
import Switch from 'material-ui/Switch'
import '../styles/SearchBar.css'

const genedDict = {
  CR: 'English Composition and Rhetoric',
  FL: 'Foreign Language',
  LF: 'Lifetime Fitness',
  PX: 'Physical and Life Sciences',
  PL: 'Physical and Life Sciences with Lab',
  HS: 'Historical Analysis',
  LA: 'Literary Arts',
  PH: 'Philosophical and Moral Reasoning',
  SS: 'Social and Behavioral',
  VP: 'Visual and Performing Arts',
  BN: 'Beyond the North Atlantic',
  CI: 'Communication Intensive',
  EE: 'Experiential Education',
  GL: 'Global Issues',
  NA: 'North Atlantic World',
  QI: 'Quantitative Intensive',
  QR: 'Quantitative Reasoning',
  US: 'U.S. Diversity',
  WB: 'World Before 1750'
}

@observer
export default class SearchBar extends React.Component<{}, { expanded: boolean }> {
  search = new CourseSearch()
  state = { expanded: true }

  componentDidMount() {
    uiStore.registerSearchBar(this)
  }

  handleDepartmentChange(value: string) {
    const input = value.toUpperCase()
    if (ALL_DEPARTMENTS.includes(input)) {
      this.search.department = Departments[input]
    } else {
      this.search.department = undefined
    }
    uiStore.updateSearchResults(this.search)
  }

  handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value, 10)
    if (value) this.search.courseNumber = value
    else this.search.courseNumber = undefined
    uiStore.updateSearchResults(this.search)
  }

  handleOperatorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.search.operator = e.target.value as Operator
    uiStore.updateSearchResults(this.search)
  }

  handleGenedChange(newGenedTags: string[]) {
    this.search.geneds = newGenedTags as Gened[]
    uiStore.updateSearchResults(this.search)
  }

  handleKeywordChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.search.keywords = e.target.value
    uiStore.updateSearchResults(this.search)
  }

  renderAutocompleteItem(item: string, details: { query: string, isHighlighted: boolean }) {
    const classes = details.isHighlighted ? 'autocomplete-item highlighted' : 'autocomplete-item'
    return (
      <span className={classes}>{item}</span>
    )
  }

  getDepartmentSuggestions(input: string) {
    const value = input.trim().toUpperCase()
    return value.length === 0 ? [] : ALL_DEPARTMENTS.filter(dept => dept.startsWith(value))
  }

  toggleListView() {
    uiStore.listView = !uiStore.listView
    uiStore.saveSettings()
  }

  render() {
    const { expanded } = this.state
    if (!expanded && !uiStore.isWideView) {
      return (
        <div className="SearchBar collapsed">
          <h2>Search for courses</h2>
          <div className="arrow">
            <img src="arrow.svg" onClick={() => this.setState({ expanded: !expanded })} alt="toggle search panel" />
          </div>
        </div>
      )
    }
    return (
      <div className={uiStore.listView && uiStore.searchResults.length > 0 ? 'SearchBar list' : 'SearchBar'}>
        <div id="searchbar-search-group" >
          <h2>Search for courses</h2>
            <div className="loader-container">
              {uiStore.searchBarResultsPending && <Spinner />}
            </div>
            <div className="first-row-container">
              <div className="first-part">
                <AutocompleteInput allSuggestions={ALL_DEPARTMENTS} expandedDict={DEPARTMENT_NAMES} placeholder="COMP" onChange={e => this.handleDepartmentChange(e)} />
                {uiStore.isSearchingDepartment && <SearchResults label={uiStore.DEPARTMENT_LABEL} items={uiStore.departmentResults} />}
                <div id="custom-select">
                  <select onChange={e => this.handleOperatorChange(e)}>
                    <option value="=">=</option>
                    <option value=">=">≥</option>
                    <option value="<=">≤</option>
                  </select>
                </div>
                <input placeholder="110" id="number-input" onChange={e => this.handleNumberChange(e)} />
              </div>
              <TagsInput allTags={ALL_GENEDS} expandedTabDict={genedDict} limit={4} onTagChange={e => this.handleGenedChange(e)} placeholder="Geneds: QR" />
            </div>
            <input id="search-input" placeholder="intro programming" onChange={e => this.handleKeywordChange(e)} />
          </div>
          <div className="search-bar-results-container">
            <SearchBarResults listView={uiStore.listView} />
          </div>
          <button id='searchbar-add-class' onClick={() => {uiStore.addClassPopupActive = true}}>Don't see a class?</button>
            {uiStore.listView ?
              <div className="list-switch-container" onClick={() => this.toggleListView()}>
                <img src="tiles.svg" alt="Tile view" /><span>Tile view</span>
              </div>
            :
              <div className="list-switch-container" onClick={() => this.toggleListView()}>
                <img src="list.svg" alt="List view" /><span>List view</span>
              </div>
            }
          {uiStore.addClassPopupActive && <AddClassPopup />}
        {!uiStore.isWideView && <div className="arrow">
          <img src="arrow.svg" onClick={() => this.setState({ expanded: !expanded })} alt="toggle search panel" />
        </div>}
      </div>
    )
  }
}