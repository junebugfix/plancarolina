import * as React from 'react';
import ProgressBar from './ProgressBar'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { times } from 'lodash'
import '../styles/Validators.css'

@observer
export default class Validators extends React.Component {

  counter = 0

  render() {
    return (
      <div className="Validators">
      </div>
    )
  }
}