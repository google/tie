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
 * @fileoverview Question data for Most Common Character.
 */

globalData.questions['findMostCommonCharacter'] = {  // eslint-disable-line dot-notation
  title: 'Most Common Character',
  starterCode: {
    python:
`def findMostCommonCharacter(s):
    return ""
`
  },
  auxiliaryCode: {
    python:
`import collections

class AuxiliaryCode(object):
    @classmethod
    def lettersOnly(cls, s):
      alpha_chars = [c for c in s if c.isalpha()]
      return collections.Counter(alpha_chars).most_common(1)[0][0]

    @classmethod
    def lettersAndNumbersOnly(cls, s):
      alphanum_chars = [c for c in s if (c.isalpha() or c.isdigit())]
      return collections.Counter(alphanum_chars).most_common(1)[0][0]

    @classmethod
    def includeSpaces(cls, s):
      counter = collections.Counter(s)
      return counter.most_common(1)[0][0]
`
  },
  tasks: [{
    id: 'findMostCommonCharacter',
    instructions: [{
      content: [
        'In this problem, we\'d like you to write a function that determines ',
        'the most common character in an ASCII string (ignoring spaces). You ',
        'may assume that the input string contains only one most common ',
        'character.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "doggo pupper"\nOutput: "p"',
      type: 'code'
    }],
    prerequisiteSkills: ['String Manipulation', 'Arrays'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findMostCommonCharacter',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'cdcdc',
        allowedOutputs: ['c']
      }, {
        input: 'babaabb',
        allowedOutputs: ['b']
      }]
    }, {
      id: 'MIXED_CASE',
      humanReadableName: 'mixed-case strings',
      testCases: [{
        input: 'BBBbbbBBBaaaaaaa',
        allowedOutputs: ['a']
      }]
    }, {
      id: 'NUMBERS',
      humanReadableName: 'strings with numbers',
      testCases: [{
        input: 'Add: 22+22=44',
        allowedOutputs: ['2']
      }]
    }, {
      id: 'SPECIAL_CHARACTERS',
      humanReadableName: 'strings with special characters',
      testCases: [{
        input: 'save 200%!!!',
        allowedOutputs: ['!']
      }]
    }, {
      id: 'SMALL_INPUTS',
      humanReadableName: 'small inputs',
      testCases: [{
        input: 'x',
        allowedOutputs: ['x']
      }]
    }, {
      id: 'MANY_SPACES',
      humanReadableName: 'strings with many spaces',
      testCases: [{
        input: 'some string with many spaces',
        allowedOutputs: ['s']
      }, {
        input: 'a    b c    d e f f',
        allowedOutputs: ['f']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.lettersOnly',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Note that the characters in the input strings may not always be ',
          'letters.'
        ].join(''),
        [
          "Try figuring out what your code would return if the string ",
          "'160000Amphitheatre' is passed in. Does it give the correct answer?"
        ].join(''),
        "What happens if you pass in strings that contain only numbers?",
        [
          "It looks like you are not handling strings properly ",
          "if they contain digits or special characters, ",
          "such as '0123456789' or '~?!@#$%'."
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.lettersAndNumbersOnly',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Note that the characters in the input strings may not always be ',
          'letters or numbers.'
        ].join(''),
        [
          'FYI, the characters in the input strings could also be symbols, ',
          'like ! and $.'
        ].join(''),
        [
          'What happens if you pass in a string that contains only ',
          'exclamation marks?'
        ].join(''),
        [
          "It looks like you are not handling strings properly ",
          "if they contain special characters, such as '~?!@#$%'."
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.includeSpaces',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'What happens if your function is given a string that has lots of ',
          'spaces in it? Remember that the question asks to ignore spaces.'
        ].join(''),
        [
          "For an input like 'a string with many spaces', your code ",
          "returns a space as the answer. But the question asks you to ",
          "ignore spaces."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: 'abbac',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'findMostCommonCharacter'
    }]
  }]
};
