import * as React from 'react'
import MUIDialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { uiStore } from '../UIStore';

export interface DialogOptions {
  titleText: string
  bodyText: string | HTMLElement
  button1Text: string
  button1Action: (event: any) => void
  button2Text?: string
  button2Action?: (event: any) => void
  imageUrl?: string
}

@observer
export default class Dialog extends React.Component {
  @observable open = false
  @observable options: DialogOptions = {
    titleText: '',
    bodyText: '',
    button1Text: '',
    button1Action: () => null
  }

  render() {
    const { button1Text, button2Text, button1Action, button2Action, bodyText, titleText, imageUrl } = this.options
    const handleButton1Click = (event: any) => {
      button1Action(event)
      this.open = false
    }
    const handleButton2Click = (event: any) => {
      button2Action(event)
      this.open = false
    }
    return (
      <MUIDialog
        open={this.open}
        onRequestClose={() => uiStore.dialog.open = false}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{titleText}</DialogTitle>
        <DialogContent style={{ display: 'flex' }}>
          {imageUrl && <img src={imageUrl} alt="Profile Image" style={{ marginRight: 15, borderRadius: '50%' }} />}
          <DialogContentText id="alert-dialog-description">{bodyText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleButton1Click} color="primary">{button1Text}</Button>
          {button2Text && button2Action && <Button onClick={handleButton2Click} color="primary" autoFocus>{button2Text}</Button>}
        </DialogActions>
      </MUIDialog>
    )
  }
}