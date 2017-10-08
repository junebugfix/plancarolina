import * as React from 'react';
import { observer } from 'mobx-react';
import '../styles/Settings.css'
import { uiStore } from '../UIStore';
import Switch from 'material-ui/Switch';

@observer
export default class App extends React.Component {
  render() {
    return (
      <div className="Settings">
        <div className="expandedView">
          <span className="settings-label expandedView">Expanded View</span>
          <br/>
          <div className="switchContainer">
            <Switch
              checked={uiStore.expandedView}
              onChange={() => uiStore.expandedView = !uiStore.expandedView}
            />
          </div>
        </div>
      </div>
    )
  }
}