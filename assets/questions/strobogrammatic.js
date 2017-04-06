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
    def firstDigitShouldNotBeZero(cls, length):
        if length == 2:
           return [["00","11","69","88","96"]]

    @classmethod
    def forgetZero(cls, length):
        if length == 1:
           return [["1","8"]]
`
  },
  tasks: [{
    instructions: [[ 
      'Implement a function which takes a number N as input and generates a list of ',
      'numbers which has length N and has rotational symmetry ',
      'rotational symmetry means you will get same number when the number is rotated 180 degree',
      'For example, for length 2 , we have [11, 69, 88, 96] '
    ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
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
      buggyFunctionName: 'AuxiliaryCode.forgetZero',
      messages: [
        "Try running your code on length 1. Did you expect that result?",
        [
          'Are you making sure you get all the answers?',
          '0 should also be included'
        ].join('')
      ]
    },
    {
      buggyFunctionName: 'AuxiliaryCode.firstDigitShouldNotBeZero',
      messages: [
        "Try running your code on length 2. Did you expect that result?",
        [
          'Are you making sure you don\'t include any strange format number?',
          'like 08?'
        ].join(''),
        "You should not include 00 in your answer."
      ]
    }],
    performanceTests: []
  }],
  styleTests: []
};
