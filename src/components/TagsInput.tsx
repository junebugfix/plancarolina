import * as React from 'react'
// import { observable } from 'mobx'
// import { observer } from 'mobx-react'
import AutocompleteInput from 'react-autocomplete'
import MUITooltip from 'material-ui/Tooltip'
import Icon from 'material-ui/Icon'
import { ALL_GENEDS } from '../CourseSearch';
import '../styles/TagsInput.css'
import { arrayEqual } from '../utils';

function Tooltip(props: any) {
  const { ...other } = props
  return (
    <MUITooltip {...other} />
  )
}

interface TagsInputProps {
  allTags: string[],
  expandedTabDict?: { [tag: string]: string },
  limit?: number,
  placeholder?: string,
  onTagChange: (tags: string[]) => void
}

interface TagsInputState {
  tags: string[],
  value: string,
  highlighted: number,
  focused: boolean 
}

export default class TagsInput extends React.Component<TagsInputProps, TagsInputState> {

  inputEl: HTMLInputElement  
  suggestionsEl: HTMLDivElement
  containerEl: HTMLDivElement
  lastTagChange: string[] = []
  counter = 0

  readonly ENTER_KEY = 13
  readonly DELETE_KEY = 8

  constructor(props: TagsInputProps) {
    super(props)
    this.state = { tags: [], value: '', highlighted: null, focused: false }
  }

  private handleBroadKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (this.state.highlighted !== null) {
      if (e.keyCode === this.DELETE_KEY) {
        this.deleteHighlightedTag()
      } else {
        this.setState({ highlighted: null })
      }
    }
  }

  private handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = (e.target as HTMLInputElement).value
    if (e.keyCode === this.ENTER_KEY) {
      e.preventDefault()
      const tag = this.formatTag(input)
      if (this.canAddTag(tag)) {
        this.addTag(tag)
      }
    } else if (e.keyCode === this.DELETE_KEY && input === '') {
      if (this.state.highlighted !== null) {
        this.deleteHighlightedTag()
      } else if (this.state.tags.length > 0) {
        this.highlightLastTag()
      }
    }
  }

  private updateValue(e: React.ChangeEvent<HTMLInputElement>) {
    const input = (e.target as HTMLInputElement).value
    this.inputEl.focus()
    this.setState({ value: input })
  }

  private handleTagChange(tags: string[]) {
    if (this.props.onTagChange && !arrayEqual(this.lastTagChange, tags)) {
      this.props.onTagChange(tags)
      this.lastTagChange = tags
    }
  }

  private canAddTag(tag: string) {
    return this.isValidTag(tag) && !this.isAlreadyAdded(tag) && !this.limitReached()
  }

  private isValidTag(tag: string) {
    return this.props.allTags.indexOf(tag) !== -1
  }

  private isAlreadyAdded(tag: string) {
    return this.state.tags.indexOf(tag) !== -1
  }

  private highlightLastTag() {
    this.inputEl.blur()
    this.containerEl.focus()
    this.setState({ highlighted: this.state.tags.length - 1, focused: false })
  }

  private deleteHighlightedTag() {
    const { tags, highlighted } = this.state
    const newTags = tags.slice()
    newTags.splice(highlighted, 1)
    this.inputEl.focus()
    this.setState({ highlighted: null, tags: newTags, focused: true })
    this.handleTagChange(newTags)
  }

  private limitReached() {
    if (!this.props.limit) return false
    return this.state.tags.length >= this.props.limit
  }

  private getSuggestions() {
    if (!this.inputEl) return []
    const input = this.inputEl.value.toUpperCase()
    const startsWith = []
    const includesNotStartsWith = []
    for (const tag of this.props.allTags) {
      if (tag.startsWith(input)) startsWith.push(tag)
      else if (tag.includes(input)) includesNotStartsWith.push(tag)
    }
    startsWith.sort()
    includesNotStartsWith.sort()
    return startsWith.concat(includesNotStartsWith)
  }

  private handleSuggestionClicked(e: React.MouseEvent<HTMLSpanElement>) {
    const tag = (e.target as HTMLSpanElement).innerText
    if (this.canAddTag(tag)) this.addTag(tag)
  }

  private handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({ focused: true, highlighted: null })
  }

  private handleBlur(e: React.FocusEvent<HTMLElement>) {
    this.setState({ focused: false, highlighted: null })
  }

  private handleTagXClicked(e: React.MouseEvent<HTMLSpanElement>) {
    const target = (e.target as HTMLSpanElement)
    const tag = target.getAttribute('data-tag')
    this.deleteTag(tag)
  }

  private deleteTag(tagToDelete: string) {
    const newState = { tags: this.state.tags.filter(tag => tag !== tagToDelete), highlighted: null }
    this.setState(newState)
    this.handleTagChange(newState.tags)
  }

  private addTag(tag: string) {
    const newState = { tags: this.state.tags.concat(tag) }
    this.setState(newState)
    this.inputEl.value = ''
    this.handleTagChange(newState.tags)
  }

  private formatTag(tag: string) {
    return tag.toUpperCase()
  }

  private getFullTagName(tag: string) {
    return this.props.expandedTabDict[tag] || tag
  }

  makeTooltip(body: any, title: string, placement: string, ...other: any[]) {
    return (
      <Tooltip title={title} placement={placement as any} {...other} >
        {body}
      </Tooltip>
    )
  }

  private renderTag(tag: string, index: number) {
    const classes = index === this.state.highlighted ? 'tag highlighted' : 'tag'
    let tagHtml = (
      <div className={classes} key={`ti-${this.counter++}`}>
        <span className="tagname">{tag}</span>
        <span data-tag={tag} onMouseDown={e => this.handleTagXClicked(e)} className="x">x</span>
      </div>
    )
    if (this.props.expandedTabDict) tagHtml = <Tooltip title={this.getFullTagName(tag)} key={`ti-${this.counter++}`} placement="top">{tagHtml}</Tooltip>
    return tagHtml
  }

  private renderSuggestion(suggestion: string) {
    let html = <span onMouseDown={e => this.handleSuggestionClicked(e)} className="gened-block block" key={`tis-${this.counter++}`}>{suggestion}</span>
    if (this.props.expandedTabDict) html = <Tooltip style={{ cursor: 'pointer' }} title={this.getFullTagName(suggestion)} key={`tis-${this.counter++}`} placement="top">{html}</Tooltip>
    return html
  }

  render() {
    const { placeholder } = this.props
    const { tags, value, focused } = this.state
    const suggestions = this.getSuggestions()
    return (
      <div className="TagsInput" tabIndex={1} ref={el => this.containerEl = el} onKeyDown={e => this.handleBroadKeyDown(e)} onBlur={e => this.handleBlur(e)}>
        {/* <div> */}
          {tags.map((tag, i) => this.renderTag(tag, i))}
          <input placeholder={this.props.placeholder} onKeyDown={e => this.handleKeyDown(e)} onChange={e => this.updateValue(e)} onFocus={e => this.handleFocus(e)} onBlur={e => this.handleBlur(e)} ref={el => this.inputEl = el} />
          {/* <Icon className="hover" onClick={this.handleExpandClicked} style={{ fontSize: 20 }}>expand_more</Icon> */}
        {/* </div> */}
        {focused && suggestions.length > 0 && <div ref={el => this.suggestionsEl = el} className="suggestions" onClick={e => e.preventDefault()}>
          {suggestions.map(s => this.renderSuggestion(s))}
        </div>}
      </div>
    )
  }
}