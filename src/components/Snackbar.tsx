import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import MUISnackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import { uiStore } from '../UIStore'

export interface SnackbarOptions {
  message: string,
  autoHideDuration?: number
  action?: (event: any) => void,
  actionLabel?: string
}

@observer
export default class Snackbar extends React.Component {
  @observable open = false
  @observable options: SnackbarOptions = {
    message: ''
  }

  render() {
    const { message, action, actionLabel, autoHideDuration } = this.options
    const actionWithClose = (e: any) => {
      action(e)
      this.open = false
    }
    const actionProp = action ? <Button key={actionLabel} color="accent" onClick={actionWithClose}>{actionLabel}</Button> : null
    return (
      <MUISnackbar
        id="snackbar"
        open={this.open}
        onRequestClose={() => uiStore.snackbar.open = false}
        message={<span>{message}</span>}
        autoHideDuration={autoHideDuration || 3000}
        action={actionProp}
      />
    )
  }
}