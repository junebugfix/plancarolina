import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import '../styles/AddMajorPopup.css'

@observer
export default class AddMajorPopup extends React.Component {
  render() {
    return (
      <div className="AddMajorPopup">
        <input placeholder="Comp Sci BS" onChange={uiStore.handleSearchingMajor} />
      </div>
    )
  }
}