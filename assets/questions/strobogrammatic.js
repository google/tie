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

globalData.questions['strobogrammatic'] = {  // eslint-disable-line dot-notation
  title: 'strobogrammatic',
  starterCode: {
    python:
`def strobogrammatic(length):
    return []
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def allowLeadingZeroInResult(cls, length):
        if length == 2:
           return [["00","11","69","88","96"]]

    @classmethod
    def forgetToIncludeZero(cls, length):
        if length == 1:
           return [["1","8"]]
`
  },
  tasks: [{
    instructions: [[ 
      'Implement a function strobogrammatic which takes a number n as input and generates a list of ',
      'n-digit numbers which look the same if you rotate them 180 degrees.',
      'For example, all the 2-digit strobogrammatic numbers are [11, 69, 88, 96].'
    ].join('')
    ],
    prerequisiteSkills: ['Arrays'],
    acquiredSkills: ['Arrays'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'strobogrammatic',
    correctnessTests: [{
      input: '2',
      allowedOutputs: [["11", "69", "88", "96"]]
    }, {
      input: '1',
      allowedOutputs: [['0', '1', '8']]
    }, {
      input: '3',
      allowedOutputs: [['101', '111', '181', '609', '619', '689', '808', '818', '906', '916', '986']]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.forgetToIncludeZero',
      messages: [
        "Try running your code for 1-digit numbers. Did you get the expected result?",
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
        "It looks like you are allowing numbers with a leading zero when they should not be included."
        "Currently, the system does not support nonlinear runtime complexities, so we are omitting performance tests, for now."
      ]
    }],
    // We need a performance test for exponential time complexity.
    performanceTests: []
  }],
  styleTests: []
};
