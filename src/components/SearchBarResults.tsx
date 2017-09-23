import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import Course from './Course'
import '../styles/SearchBarResults.css'

@observer
export default class SearchBarResults extends React.Component {
  divEl: HTMLDivElement;

  componentDidMount() {
    uiStore.registerSlipList(this.divEl)
  }

  render() {
    return (
      <div ref={el => this.divEl = el} className="SearchBarResults">
        {uiStore.searchResults.map(res => <Course key={`search-${res.id}`} data={res} />)}
      </div>
    )
  }
}