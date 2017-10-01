import * as React from 'react';
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import '../styles/Validators.css'

@observer
export default class Validators extends React.Component {

    render() {
        return (
            <div id="validator-button-container">
                <button onClick={() => scheduleStore.validateGenEds(scheduleStore.allSemesters)}>Validate Gen Eds</button>
            </div>
        )
    }
}