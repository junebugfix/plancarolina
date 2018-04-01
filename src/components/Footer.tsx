import * as React from 'react';
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import '../styles/Footer.css'
import { uiStore } from '../UIStore';

@observer
export default class Footer extends React.Component {
  render() {
    return (
      <footer className="Footer">
        <span id="created-by">Created&nbsp;by&nbsp;{uiStore.isMobileView && <br />}
          <a href="https://github.com/hankhester">Hank&nbsp;Hester</a>
          <a href="https://github.com/brooksmtownsend">Brooks&nbsp;Townsend</a>
          <a href="https://github.com/kate-goldenring">Kate&nbsp;Goldenring</a>
        </span>
        <span id="contact-us-at">Contact us at&nbsp;
          <a href="mailto:hello@plancarolina.com">hello@plancarolina.com</a>
        </span>
      </footer>
    )
  }
}