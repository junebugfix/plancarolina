import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { scheduleStore } from '../ScheduleStore';
import { uiStore } from '../UIStore';
import { Summers } from './Schedule'

@observer
export default class Summer extends React.Component<{index: Summers}, {}> {
  divEl: HTMLDivElement

  render() {
    return (
      <div className="Summer">
        <div ref={el => this.divEl = el}>
          {/* scheduleStore.first */}
        </div>
      </div>
    )
  }
}