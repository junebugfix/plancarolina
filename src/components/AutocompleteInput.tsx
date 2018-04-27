import * as React from 'react'
import Autosuggest from 'react-autosuggest'
import '../styles/AutocompleteInput.css'
import { ALL_DEPARTMENTS } from '../CourseSearch';

const DOWN_KEY = 40
const UP_KEY = 38
const ENTER_KEY = 13
const TAB_KEY = 9

export default class AutocompleteInput extends React.Component<{ allSuggestions: string[], expandedDict?: { [key: string]: string }, onValidSelection?: (val: string) => void, placeholder?: string }, { highlightedIndex: number, value: string, focused: boolean, suggestions: string[] }> {
  inputEl: HTMLInputElement
  counter = 0

  constructor(props: any) {
    super(props)
    this.state = { highlightedIndex: 0, value: '', focused: false, suggestions: [] }
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value
    const suggestions = this.getSuggestions(value)
    this.setState({ value, suggestions, highlightedIndex: 0 })
    if (this.props.onValidSelection && this.isValidInput(value) && value !== '') {
      this.props.onValidSelection(value)
    }
  }

  handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({ focused: true })
  }

  handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({ focused: false, highlightedIndex: 0 })
  }

  handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (this.state.suggestions.length > 0) {
      if (e.keyCode === ENTER_KEY) {
        e.preventDefault()
        this.completeHighlightedSuggestion()
      } else if (e.keyCode === DOWN_KEY || (e.keyCode === TAB_KEY && !e.shiftKey)) {
        e.preventDefault()
        this.moveHighlightDown()
      } else if (e.keyCode === UP_KEY || (e.keyCode === TAB_KEY && e.shiftKey)) {
        e.preventDefault()
        this.moveHightlightUp()
      }
    }
  }

  completeHighlightedSuggestion() {
    const suggestion = this.state.suggestions[this.state.highlightedIndex]
    this.inputEl.value = suggestion
    this.setState({ value: suggestion })
    if (this.props.onValidSelection) this.props.onValidSelection(suggestion)
    this.inputEl.blur()
  }

  moveHighlightDown() {
    const index = this.state.highlightedIndex
    let newIndex
    if (index === this.state.suggestions.length - 1) {
      newIndex = 0
    } else {
      newIndex = index + 1
    }
    this.setState({ highlightedIndex: newIndex })
  }

  moveHightlightUp() {
    const index = this.state.highlightedIndex
    let newIndex
    if (index === 0) {
      newIndex = this.state.suggestions.length - 1
    } else {
      newIndex = index - 1
    }
    this.setState({ highlightedIndex: newIndex })
  }

  isValidInput(input: string) {
    if (input === '') return true
    return ALL_DEPARTMENTS.indexOf(input.trim().toUpperCase()) !== -1
  }

  getExpandedName(input: string) {
    if (!this.props.expandedDict) return input
    const expandedName = this.props.expandedDict[input]
    if (!expandedName) return input
    return `${input} - ${this.props.expandedDict[input]}`
  }

  getSuggestions(input: string) {
    const value = input.trim().toUpperCase()
    return value.length === 0 ? [] : this.props.allSuggestions.filter(s => s.startsWith(value) && s !== value)
  }

  renderSuggestion(suggestion: string, index: number) {
    const classes = this.state.highlightedIndex === index ? 'item highlighted' : 'item'
    const text = this.props.expandedDict ? this.getExpandedName(suggestion) : suggestion
    let html = <span key={`as-${this.counter++}`} className={classes}>{text}</span>
    return html
  }

  render() {
    const { placeholder } = this.props
    const { focused, suggestions, value } = this.state
    const inputClasses = this.isValidInput(value) || focused ? null : 'error'
    return (
      <div className="AutocompleteInput">
      <input ref={el => this.inputEl = el} className={inputClasses} onChange={e => this.handleChange(e)} onFocus={e => this.handleFocus(e)} onBlur={e => this.handleBlur(e)} onKeyDown={e => this.handleKeyDown(e)} placeholder={placeholder} />
      {focused && this.state.suggestions.length > 0 && <div className="suggestions">
        {suggestions.map((s, i) => this.renderSuggestion(s, i))}
      </div>}
      </div>
    )
  }
}