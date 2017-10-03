import * as React from 'react';
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import '../styles/ProgressBar.css'

@observer
export default class ProgressBar extends React.Component<{ fulfilled: string[] | number, needed: string[] | number }, {}> {
  render() {
    if (typeof(this.props.fulfilled) === 'number') {
      const fulfilled = this.props.fulfilled as number
      const needed = this.props.needed as number
      return (
        <div className="ProgressBar">

        </div>
      )
    } else {
      const fulfilled = this.props.fulfilled as string[]
      const needed = this.props.needed as string[]
      console.log(typeof(needed))
      return (
        <div className="ProgressBar">
         {/* {needed.map(s => <div key={`progress-${s}-${Math.random()}`}>s</div>)} */}
         {this.props.fulfilled}
         {this.props.needed}
        </div>
      )
    }
  }
}