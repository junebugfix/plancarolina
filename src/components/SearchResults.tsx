import * as React from 'react'
import { observer } from 'mobx-react'
import '../styles/SearchResults.css'

@observer
export default class SearchResults extends React.Component<{ label: string, items: string[] }, {}> {

  counter = 0

  getKey() {
    return `${this.props.label}-${this.counter++}`
  }

  render() {
    return (
      <div className="SearchResults">
        {this.props.items.map(item => <div key={this.getKey()} className="SearchResults-item">{item}</div>)}
      </div>
    )
  }
}