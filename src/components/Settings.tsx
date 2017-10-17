import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import '../styles/Settings.css'
import { uiStore } from '../UIStore';
import Switch from 'material-ui/Switch';
import Menu, { MenuItem } from 'material-ui/Menu';

@observer
export default class App extends React.Component {
  @observable selectSummerActive = false
  summerAnchorEl: HTMLElement

  componentDidMount() {
    this.summerAnchorEl = document.getElementById('add-summer-button')
  }

  handleSummerSelected(summerIndex: number) {
    this.selectSummerActive = false
    uiStore.summersActive = true
    if (summerIndex === 0) uiStore.firstYearSummerActive = true
    else if (summerIndex === 1) uiStore.sophomoreSummerActive = true
    else if (summerIndex === 2) uiStore.juniorSummerActive = true
    else if (summerIndex === 3) uiStore.seniorSummerActive = true
  }

  render() {
    return (
      <div className="Settings">
        <div className="expandedView">
          <span className="settings-label expandedView">Expanded View</span>
          <div className="switchContainer">
            <Switch
              checked={uiStore.expandedView}
              onChange={() => uiStore.expandedView = !uiStore.expandedView}
            />
          </div>
        </div>
        <div className="add-summer">
          <button id="add-summer-button" onClick={() => this.selectSummerActive = true}>Add summer</button>
        </div>
        <Menu
          anchorEl={this.summerAnchorEl}
          open={this.selectSummerActive}
          onRequestClose={() => this.selectSummerActive = false}
        >
          <MenuItem onClick={() => this.handleSummerSelected(0)}>First-Year</MenuItem>
          <MenuItem onClick={() => this.handleSummerSelected(1)}>Sophomore</MenuItem>
          <MenuItem onClick={() => this.handleSummerSelected(2)}>Junior</MenuItem>
          <MenuItem onClick={() => this.handleSummerSelected(3)}>Senior</MenuItem>
        </Menu>
      </div>
    )
  }
}