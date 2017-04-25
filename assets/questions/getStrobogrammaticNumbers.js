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
 * @fileoverview Question data for strobogrammatic number.
 */

globalData.questions['getStrobogrammaticNumbers'] = {  // eslint-disable-line dot-notation
  title: 'Get N-Digit Strobogrammatic Numbers',
  starterCode: {
    python:
`def getStrobogrammaticNumbers(num_digits):
    return []
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def allowLeadingZeroInResult(cls, num_digits):
        if num_digits == 2:
           return [["00", "11", "69", "88", "96"]]
        if num_digits == 3:
           return  [[
             '000', '010', '080', '101', '111', '181', '609', '619', '689',
             '808', '818', '906', '916', '986']]

    @classmethod
    def forgetToIncludeZero(cls, num_digits):
        if num_digits == 1:
           return [["1", "8"]]
`
  },
  tasks: [{
    instructions: [
      {
        content: [
          'Implement a function getStrobogrammaticNumbers which takes a ',
          'number n as input and generates a list of n-digit numbers which ',
          'look the same if you rotate them 180 degrees.'
        ].join(''),
        type: 'text'
      },
      {
        content: 'Input: 2\nOutput: ["11", "69", "88", "96"]',
        type: 'code'
      }
    ],
    prerequisiteSkills: ['Arrays'],
    acquiredSkills: ['Arrays'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'getStrobogrammaticNumbers',
    correctnessTests: [{
      input: '2',
      allowedOutputs: [["11", "69", "88", "96"]],
      tag: 'small sized numbers'
    }, {
      input: '1',
      allowedOutputs: [['0', '1', '8']],
      tag: 'small sized numbers'
    }, {
      input: '3',
      allowedOutputs: [['101', '111', '181', '609', '619', '689',
        '808', '818', '906', '916', '986']],
      tag: '3 digit numbers'
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.forgetToIncludeZero',
      messages: [
        "Which 1-digit numbers does your function return?",
        [
          'Are you returning all appropriate numbers?',
          '0, for instance, should be included.'
        ].join('')
      ]
    },
    {
      buggyFunctionName: 'AuxiliaryCode.allowLeadingZeroInResult',
      messages: [
        "Try running your code on 2-digit numbers. Did you get the expected result?",
        [
          'What happens if the number has a leading zero, like 08?',
          'Should it still be included?'
        ].join(''),
        [
          "It looks like you are allowing numbers with a leading zero",
          "when they should not be included."
        ].join('')
      ]
    }],
    // Currently, the system does not support nonlinear runtime complexities.
    // So we are omitting performance tests for now.
    performanceTests: []
  }],
  styleTests: []
};

