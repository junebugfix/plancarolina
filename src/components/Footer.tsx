import * as React from 'react';
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import '../styles/Footer.css'

@observer
export default class Footer extends React.Component {
  render() {
    return (
      <div className="Footer">
        <span id="created-by">Created by&nbsp;
          <a href="https://github.com/hankhester">Hank Hester</a>
          <a href="https://github.com/brooksmtownsend">Brooks Townsend</a>
          <a href="https://github.com/kate-goldenring">Kate Goldenring</a>
        </span>
        <span id="contact-us-at">Contact us at&nbsp;
          <a href="mailto:hello@plancarolina.com">hello@plancarolina.com</a>
        </span>
      </div>
    )
  }
}