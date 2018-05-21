import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import '../styles/SearchVisualization.css'
import CourseSearch from '../CourseSearch'
import { Departments } from '../departments'

@observer
export default class SearchVisualization extends React.Component<{ search: CourseSearch }, {}> {
  counter = 0

  render() {
    const { search } = this.props
    if (!search) return (<div className="SearchVisualization"></div>)
    return (
      <div className="SearchVisualization">
        {search.department && <span className="block department">{Departments[search.department]}</span>}
        {search.courseNumber && <span className="block course-number">{search.operator && search.operator + ' '}{search.courseNumber}</span>}
        {search.geneds.map(gened => <span className="block gened" key={`sge-${this.counter++}`}>{gened}</span>)}
        {search.keywords && <span className="block keywords">{search.keywords}</span>}
      </div>
    )
  }
}