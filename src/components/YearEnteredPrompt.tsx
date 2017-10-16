import * as React from 'react'
import { observer } from 'mobx-react'
import { uiStore } from '../UIStore'
import '../styles/YearEnteredPrompt.css'

@observer
export default class YearEnteredPrompt extends React.Component {

    render() {
   return (
      <div className="YearEnteredPrompt">
          <button className="choose2013" onClick={() => uiStore.yearEnteredCallback(2013)}>
            2013
          </button>
           <button className="choose2014" onClick={() => uiStore.yearEnteredCallback(2014)}>
            2014
          </button>
          <button className="choose2015" onClick={() => uiStore.yearEnteredCallback(2015)}>
            2015
          </button>
          <button className="choose2016" onClick={() => uiStore.yearEnteredCallback(2016)}>
            2016
          </button>
          <button className="choose2017" onClick={() => uiStore.yearEnteredCallback(2017)}>
            2017
          </button>
      </div>
    )
    }
}