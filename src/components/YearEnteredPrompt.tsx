import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import Popover from 'material-ui/Popover';
import '../styles/YearEnteredPrompt.css'
import Menu, { MenuItem } from 'material-ui/Menu';
import { Button } from 'material-ui';

@observer
export default class YearEnteredPrompt extends React.Component {
yearAnchorEl: HTMLElement;
  render() {
  this.yearAnchorEl = document.getElementById('amp')
  
  return (
      <div className="YearEnteredPrompt">
        <Menu
          anchorEl={this.yearAnchorEl}
          open={uiStore.yearEnteredPromptActive}
          onRequestClose={() => uiStore.yearEnteredPromptActive = false}
        >
          <MenuItem>Year of Entry at UNC</MenuItem>
          <MenuItem onClick={() => uiStore.yearEnteredCallback(2013)}>2013</MenuItem>
          <MenuItem onClick={() => uiStore.yearEnteredCallback(2014)}>2014</MenuItem>
          <MenuItem onClick={() => uiStore.yearEnteredCallback(2015)}>2015</MenuItem>
          <MenuItem onClick={() => uiStore.yearEnteredCallback(2016)}>2016</MenuItem>
          <MenuItem onClick={() => uiStore.yearEnteredCallback(2017)}>2017</MenuItem>
        </Menu>
      </div>
    )
  }
}