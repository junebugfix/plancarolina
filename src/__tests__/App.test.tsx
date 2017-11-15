import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as TestUtils from 'react-addons-test-utils'

import App from '../components/App'
import LoginPopup from '../components/LoginPopup'

test('Basic Math', () => {
  expect(1 + 3).toBe(4)
})

test('App loads', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <LoginPopup />,
    div )
})