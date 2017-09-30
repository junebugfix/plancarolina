import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import { Departments } from '../departments'
import '../styles/Course.css'

export type CourseData = {
  id: number,
  department: string,
  number: string
  name: string,
  credits: number,
  geneds: string[],
  description: string,
}

@observer
export default class Course extends React.Component<{ data: CourseData }, {}> {

  constructor(props: { data: CourseData }) {
    super(props)
  }

  render() {
    const data = this.props.data
    let style = {
      backgroundColor: `hsl(${uiStore.getDepartmentHue(data.department)}, 80%, 80%)`
    }
    return (
      <div className="Course" id={`course-${data.id}`} style={style} onClick={() => this.showDescription(data)}>{data.department} {data.number}</div>
    )
  }

  showDescription(course: CourseData): void {
    let DOMCourse = document.getElementById(`course-${course.id}`);
    
    let element = document.createElement("div");
    element.innerText = course.department + " " + course.number + "\n" + course.description;
    element.id = "course-description";
    element.onmouseleave = () => {
      DOMCourse.removeChild(DOMCourse.childNodes.item(DOMCourse.childNodes.length - 1));
      DOMCourse.innerText = course.department + " " + course.number;
    }

    if (!(DOMCourse.childNodes.length > 9)) {
      DOMCourse.innerText = "";
      DOMCourse.appendChild(element);
    }
  }
}