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
 * @fileoverview Question data for incrementDecCodedNumber.
 */


/* eslint no-magic-numbers: ["error",
                            { "ignore": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }] */

globalData.questions['incrementDecimalCodedNumber'] = {  // eslint-disable-line dot-notation
  title: 'Increment a Decimal-Coded Number',
  starterCode: {
    python:
`def increment(digits):
    return []
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def createDigits(cls, atom, input_size):
        result = []
        for i in xrange(input_size):
          result.append(int(atom))
        return result

    @classmethod
    def incrementLastDigitOnly(cls, digits):
        digits_array = [x for x in digits]
        digits_array[-1] += 1
        return digits_array

    @classmethod
    def incrementWithoutChangingSize(cls, digits):
        digits_array = [x for x in digits]
        digits_array[-1] = (digits_array[-1] + 1) % 10
        carry = (digits_array[-1] == 0)
        for i in xrange(len(digits_array) - 2, -1, -1):
            if carry == False:
                break
            digits_array[i] = (digits_array[i] + 1) % 10
            carry = (digits_array[-1] == 0)

        return digits_array
`
  },
  tasks: [{
    id: 'incrementNumber',
    instructions: [{
      content: [
        'In this problem, you\'ll write a function to increment a ',
        'decimal-coded number, which is a list of digits (0 - 9) which ',
        'represent a decimal number (such as [1, 2] for 12 or [3, 2, 4] for ',
        '324). Your task is to increment a given decimal-coded number and ',
        'return the result (a list of digits).'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: [1, 2, 3, 4]\nOutput: [1, 2, 3, 5]',
      type: 'code'
    }, {
      content: 'Input: [2, 0, 9]\nOutput: [2, 1, 0]',
      type: 'code'
    }],
    prerequisiteSkills: ['Arrays'],
    acquiredSkills: ['Array Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'increment',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: [1, 2, 3, 4],
        allowedOutputs: [[1, 2, 3, 5]]
      }]
    }, {
      id: 'LAST_DIGIT_NINE',
      humanReadableName: 'last digit 9',
      testCases: [{
        input: [2, 0, 9],
        allowedOutputs: [[2, 1, 0]]
      }, {
        input: [2, 7, 8, 9],
        allowedOutputs: [[2, 7, 9, 0]]
      }]
    }, {
      id: 'SINGLE_DIGITS',
      humanReadableName: 'single digits',
      testCases: [{
        input: [0],
        allowedOutputs: [[1]]
      }]
    }, {
      id: 'MULTIPLE_NINES_AT_END',
      humanReadableName: 'multiple 9s at the end',
      testCases: [{
        input: [1, 9, 9],
        allowedOutputs: [[2, 0, 0]]
      }]
    }, {
      id: 'ALL_NINES',
      humanReadableName: 'all 9s',
      testCases: [{
        input: [9],
        allowedOutputs: [[1, 0]]
      }, {
        input: [9, 9],
        allowedOutputs: [[1, 0, 0]]
      }, {
        input: [9, 9, 9],
        allowedOutputs: [[1, 0, 0, 0]]
      }, {
        input: [9, 9, 9, 9],
        allowedOutputs: [[1, 0, 0, 0, 0]]
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.incrementLastDigitOnly',
      ignoredTestSuiteIds: [],
      messages: [
        "Try running your code on [1, 9] in your head. What's the result?.",
        [
          "It doesn't look like you're carrying when you increment a number ",
          "like 19 or 29."
        ].join(''),
        [
          "You should also increment the next digit by 1 when incrementing a 9."
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.incrementWithoutChangingSize',
      ignoredTestSuiteIds: [],
      messages: [
        "What happens when you run your code on [9]?",
        "Are you adding on new digits when necessary?",
        [
          "If you increment [9] or [9, 9], you will need to add an extra ",
          "digit to the array and return [1, 0] or [1, 0, 0], respectively."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: '9',
      transformationFunctionName: 'AuxiliaryCode.createDigits',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'increment'
    }]
  }]
};
