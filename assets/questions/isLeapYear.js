// Copyright 2017 The TIE Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Question data for isLeapYear question.
 */

globalData.questions['isLeapYear'] = {  // eslint-disable-line dot-notation
  title: 'Identifying Leap Years',
  starterCode: {
    python:
`def isLeapYear(year):
    return False
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def returnNone(cls, unused_year):
        return None

    @classmethod
    def returnTrue(cls, unused_year):
        return True

    @classmethod
    def returnFalse(cls, unused_year):
        return False

    @classmethod
    def handleDivisibleByFourCaseOnly(cls, year):
        return year % 4 == 0
`
  },
  tasks: [{
    id: 'isLeapYear',
    instructions: [{
      content: [
        'To determine whether or not a given year is a leap year, we must ',
        'consider three criteria:'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'The year is evenly divisible by 4;'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'If the year can be evenly divided by 100, it is NOT a leap year, ',
        'unless:'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'The year is also evenly divided by 400. Then it is a leap year.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Write a function that takes a year and returns True if the year is a ',
        'leap year, and False otherwise. For example:'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: 2018\nOutput: False',
      type: 'code'
    }],
    prerequisiteSkills: [],
    acquiredSkills: ['Conditionals'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'isLeapYear',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'NOT_DIVISIBLE_BY_FOUR',
      humanReadableName: 'the not-divisible-by-4 case',
      testCases: [{
        input: 1903,
        allowedOutputs: [false]
      }, {
        input: 1,
        allowedOutputs: [false]
      }, {
        input: 1905,
        allowedOutputs: [false]
      }, {
        input: 702,
        allowedOutputs: [false]
      }]
    }, {
      id: 'DIVISIBLE_BY_FOUR_BUT_NOT_ONE_HUNDRED',
      humanReadableName: 'the divisible-by-4-but-not-100 case',
      testCases: [{
        input: 1904,
        allowedOutputs: [true]
      }, {
        input: 1976,
        allowedOutputs: [true]
      }, {
        input: 2004,
        allowedOutputs: [true]
      }, {
        input: 2016,
        allowedOutputs: [true]
      }]
    }, {
      id: 'DIVISIBLE_BY_ONE_HUNDRED_BUT_NOT_FOUR_HUNDRED',
      humanReadableName: 'the divisible-by-100-but-not-400 case',
      testCases: [{
        input: 1900,
        allowedOutputs: [false]
      }, {
        input: 1700,
        allowedOutputs: [false]
      }, {
        input: 2100,
        allowedOutputs: [false]
      }, {
        input: 3400,
        allowedOutputs: [false]
      }]
    }, {
      id: 'DIVISIBLE_BY_FOUR_HUNDRED',
      humanReadableName: 'the divisible-by-400 case',
      testCases: [{
        input: 2000,
        allowedOutputs: [true]
      }, {
        input: 1600,
        allowedOutputs: [true]
      }, {
        input: 400,
        allowedOutputs: [true]
      }, {
        input: 1200,
        allowedOutputs: [true]
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.returnNone',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'It looks like your program is not returning anything. Did you ',
          'forget to include a "return" statement?'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnTrue',
      ignoredTestSuiteIds: [],
      messages: [
        [
          "It looks like you're consistently returning True for all test ",
          'cases. This implies that every year is a leap year, which is not ',
          'true.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnFalse',
      ignoredTestSuiteIds: [],
      messages: [
        [
          "It looks like you're consistently returning False for all test ",
          "cases. This implies there are no leap years, but that is not ",
          "true."
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.handleDivisibleByFourCaseOnly',
      ignoredTestSuiteIds: [],
      messages: [
        "Check the output of your program for a test case like 1900.",
        [
          "According to the question, if the year is divisible by 100 but not ",
          "400, your program should return False."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
  }]
};
