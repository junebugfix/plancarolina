import * as React from 'react'
import { store } from '../Store'
import Course from './Course'
import { Departments } from '../departments'
import { CourseData } from './Course'
import '../styles/Semester.css'

// export type SemesterId = 'fall1' | 'fall2' | 'fall3' | 'fall4' | 'fall5' | 'spring1' | 'spring2' | 'spring3' | 'spring4' | 'spring5'

// export const semesterIds: SemesterId[] = ['fall1', 'fall2', 'fall3', 'fall4', 'fall5', 'spring1', 'spring2', 'spring3', 'spring4', 'spring5']

// export function indexToSemesterId(index: number | string): Semesters {
//   return Semesters[index]
// }

// export function semesterIdToIndex(semesterId: Semesters): number {

// }

export enum Semesters {
  Fall1,
  Fall2,
  Fall3,
  Fall4,
  Fall5,
  Spring1,
  Spring2,
  Spring3,
  Spring4,
  Spring5
}

interface SemesterProps {
  data: CourseData[],
  index: Semesters
}

export default class Semester extends React.Component<SemesterProps, {}> {

  divEl: HTMLDivElement; // store the div element of the semester with a 'ref' attribute (see render below) to pass it to Sortable

  // constructor(props: SemesterProps) {
  //   super(props)
  // }

  componentDidMount() {
    const Sortable = require('sortablejs')
    let sortable = Sortable.create(this.divEl, {
      animation: 100,
      scroll: false,
      group: 'semesters',
      ghostClass: 'sortable-ghost',
      onSort: (e: Event) => {
        store.updateSemester(e.target as HTMLDivElement)
      }
    })
  }

  render() {
    const data = this.props.data
    
    let courses = []
    for (let i = 0; i < data.length; i++) {
      courses.push(<Course key={i} data={data[i]} />)
    }

    return (
      <div ref={(input) => { this.divEl = input as HTMLDivElement; }} className="Semester" id={`${Semesters[this.props.index]}`}>{courses}</div>
    )
  }
}