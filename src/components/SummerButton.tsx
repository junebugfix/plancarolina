import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import '../styles/SummerButton.css'

@observer
export default class SummerButton extends React.Component {
  render() {
    return (
      <div className="SummerButton">
        <button>Add Summer</button>
      </div>
    )
  }
}