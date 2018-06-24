import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { uiStore } from '../UIStore'
import Switch from 'material-ui/Switch'
import Menu, { MenuItem } from 'material-ui/Menu'
import '../styles/Settings.css'

@observer
export default class App extends React.Component {
  @observable selectSummerActive = false
  summerAnchorEl: HTMLElement

  componentDidMount() {
    this.summerAnchorEl = document.getElementById('add-summer-button')
  }

  handleSummerSelected(summerIndex: number) {
    this.selectSummerActive = false
    if (summerIndex === 0) uiStore.summer1Active = true
    else if (summerIndex === 1) uiStore.summer2Active = true
    else if (summerIndex === 2) uiStore.summer3Active = true
    else if (summerIndex === 3) uiStore.summer4Active = true
    else throw new Error('invalid summer index: ' + summerIndex)
    uiStore.saveSettings()
  }

  render() {
    return (
      <div className="Settings">
        {!uiStore.isMobileView && <div className="expandedView">
          <span className="settings-label expandedView">Show GenEds</span>
          <div className="switchContainer">
            <Switch
              checked={uiStore.expandedView}
              onChange={() => {
                uiStore.expandedView = !uiStore.expandedView
                uiStore.saveSettings()
              }}
            />
          </div>
        </div>}
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