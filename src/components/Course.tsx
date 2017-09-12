import * as React from 'react'
import Store from '../Store'
import { Departments } from '../departments'
import '../styles/Course.css'

export type CourseData = {
  id: number,
  name: string,
  genEds: string[],
  department: string,
  number: string
}

export default class Course extends React.Component<{data: CourseData}, {}> {
  render() {
    const data = this.props.data
    let color = (Departments[data.department] + 1) * (360 / (Object.keys(Departments).length / 2)) // Getting length of an enum is weird: https://stackoverflow.com/questions/38034673/determine-the-number-of-enum-elements-typescript?answertab=votes#tab-top
    let style = {
      backgroundColor: `hsl(${color}, 80%, 80%)`
    }
    return (
      <div className="Course" id={`${data.id}`} style={style}>{data.department} {data.number}</div>
    )
  }
}