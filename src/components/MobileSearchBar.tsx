import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import Spinner from './Spinner';
import SearchBarResults from './SearchBarResults';
import SearchInput from './SearchInput';
import SearchVisualization from './SearchVisualization'
import '../styles/MobileSearchBar.css'

@observer
export default class MobileSearchBar extends React.Component {
  counter = 0

  render() {
    return (
      <div>
        <div className="MobileSearchBar">
        </div>
      </div>
    )
  }
}