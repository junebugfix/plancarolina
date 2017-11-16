import * as React from 'react'
import { uiStore } from '../UIStore'

export class MajorWorksheetLink extends React.Component<{major: string, url: string}> {

  render() {
    return (
      <div onClick={() => openWorksheet(this.props.url)}>
        <span> {this.props.major} </span>
      </div>
    )
  }
}

function openWorksheet(url: string) {
    uiStore.showOpenWorksheetButton(url)
}