import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import Spinner from './Spinner';
import '../styles/MobileSearchBar.css'

@observer
export default class MobileSearchBar extends React.Component {

  render() {
    return (
      <div className="MobileSearchBar">

      </div>
    )
  }
}