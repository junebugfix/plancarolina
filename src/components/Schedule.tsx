import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Semester from './Semester'
import { Semesters } from '../utils'
import { CourseData } from './Course'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import Icon from 'material-ui/Icon'
import { CircularProgress } from 'material-ui/Progress'
import Spinner from './Spinner'
import '../styles/Schedule.css'

export interface ScheduleData {
  fall1: CourseData[]
  fall2: CourseData[]
  fall3: CourseData[]
  fall4: CourseData[]
  fall5: CourseData[]
  spring1: CourseData[]
  spring2: CourseData[]
  spring3: CourseData[]
  spring4: CourseData[]
  spring5: CourseData[]
  summer1: CourseData[]
  summer2: CourseData[]
  summer3: CourseData[]
  summer4: CourseData[]
}

@observer
export default class Schedule extends React.Component {
  render() {
    const type = uiStore.isMobileView ? 'mobile' : 'normal'
    return (
      <div className="Schedule">
        {/* {!scheduleStore.initialLoadDone && scheduleStore.hasHitInitialLoadSpinnerThreshold && <div className="initial-spinner-container"><Spinner radius={30} thickness={5} /></div>} */}
        <div className="Schedule-row Schedule-year-labels">
          <div className="Schedule-year-label">First-Year</div>
          <div className="Schedule-year-label">Sophomore</div>
          <div className="Schedule-year-label">Junior</div>
          <div className="Schedule-year-label">Senior</div>
        </div>
        <div className="Schedule-row">
          <Semester label="Fall" type={type} index={Semesters.Fall1} courses={scheduleStore.fall1} />
          <Semester label="Fall" type={type} index={Semesters.Fall2} courses={scheduleStore.fall2} />
          <Semester label="Fall" type={type} index={Semesters.Fall3} courses={scheduleStore.fall3} />
          <Semester label="Fall" type={type} index={Semesters.Fall4} courses={scheduleStore.fall4} />
          {uiStore.fall5Active &&
          <Semester label="Fall" type={type} index={Semesters.Fall5} courses={scheduleStore.fall5} />}
        </div>
        <div className="Schedule-row">
          <Semester label="Spring" type={type} index={Semesters.Spring1} courses={scheduleStore.spring1} />
          <Semester label="Spring" type={type} index={Semesters.Spring2} courses={scheduleStore.spring2} />
          <Semester label="Spring" type={type} index={Semesters.Spring3} courses={scheduleStore.spring3} />
          <Semester label="Spring" type={type} index={Semesters.Spring4} courses={scheduleStore.spring4} />
          {uiStore.spring5Active &&
          <Semester label="Spring" type={type} index={Semesters.Spring5} courses={scheduleStore.spring5} />}
        </div>
        {uiStore.isAnySummerActive &&
        <div className="Schedule-row summers">
          <div className="container summer1">
            {uiStore.summer1Active && <Semester label="Summer" type={type} index={Semesters.Summer1} courses={scheduleStore.summer1} />}
          </div>
          <div className="container summer2">
            {uiStore.summer2Active && <Semester label="Summer" type={type} index={Semesters.Summer2} courses={scheduleStore.summer2} />}
          </div>
          <div className="container summer3">
            {uiStore.summer3Active && <Semester label="Summer" type={type} index={Semesters.Summer3} courses={scheduleStore.summer3} />}
          </div>
          <div className="container summer4">
            {uiStore.summer4Active && <Semester label="Summer" type={type} index={Semesters.Summer4} courses={scheduleStore.summer4} />}
          </div>
        </div>
        }
      </div>
    )
  }
}