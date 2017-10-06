import * as React from 'react';
import { observer } from 'mobx-react';
import { uiStore } from '../UIStore';
import Switch from 'material-ui/Switch';

@observer
export default class App extends React.Component {
  render() {
    return (
      <div className="Settings">
        <div className="expandedView">
          <Switch
            checked={uiStore.expandedView}
            onChange={() => uiStore.expandedView = !uiStore.expandedView}
          />
        </div>
      </div>
    )
  }
}