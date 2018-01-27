'use strict'

import App from '../components/App'

var React = require('react')
var ReactDOM =  require('react-dom')
var mocha = require('mocha')
var expect = require('chai').expect

describe("App tests", () => {
  it('Tests work', () => {
    let zero = 0
    let x = <App />
    expect(0).to.equal(zero)
  })
})