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
 * @fileoverview Question data for finding the
 * First Non-Repeating Character in a String.
 */

globalData.questions['findFirstNonRepeatingCharacter'] = { // eslint-disable-line dot-notation
  title: 'Find the First Non-Repeating Character in a String',
  starterCode: {
    python: `def findFirstNonRepeatingCharacter(str):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def sortCharactersInString(cls, str):
        sortedStr = ''.join(sorted(str))
        uniqueChar = [a for a in sortedStr if sortedStr.count(a) == 1]
        if not uniqueChar:
            return None
        else:
            return uniqueChar[0]
`
  },
  tasks: [{
    id: 'findFirstNonRepeatingCharacter',
    instructions: [{
      content: [
        'For this question, you will implement a ',
        'findFirstNonRepeatingCharacter function. ',
        'This function takes a string as input and returns ',
        'the first character that isn\'t repeated elsewhere in the string.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "mom"\nOutput: "o"',
      type: 'code'
    }, {
      content: 'If there is no appropriate character, return None.',
      type: 'text'
    }],
    prerequisiteSkills: ['Strings'],
    acquiredSkills: ['String Manipulation', 'Hash Maps'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findFirstNonRepeatingCharacter',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'mom',
        allowedOutputs: ['o']
      }, {
        input: 'apple',
        allowedOutputs: ['a']
      }, {
        input: 'wefffa',
        allowedOutputs: ['w']
      }, {
        input: 'weffwa',
        allowedOutputs: ['e']
      }]
    }, {
      id: 'EMPTY_STRINGS',
      humanReadableName: 'empty strings',
      testCases: [{
        input: '',
        allowedOutputs: [null]
      }]
    }, {
      id: 'NO_REPEATED_CHARACTERS',
      humanReadableName: 'no repeated characters',
      testCases: [{
        input: 'aaaeee',
        allowedOutputs: [null]
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.sortCharactersInString',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Try running your code on \'wefffa\' on paper. What\'s the result?'
        ].join(''),
        'It looks like you\'re returning a unique character, ',
        'but it is not the first one in the provided string.'
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'handleNonLetters',
    instructions: [{
      content: 'Next, update your code to handle more than just letters.',
      type: 'text'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findFirstNonRepeatingCharacter',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'TT AsAs',
        allowedOutputs: [' ']
      }]
    }, {
      id: 'CASE_SENSITIVE_INPUTS',
      humanReadableName: 'case sensitive inputs',
      testCases: [{
        input: 'AbCABcBb',
        allowedOutputs: ['C']
      }]
    }, {
      id: 'NUMBERS',
      humanReadableName: 'numbers',
      testCases: [{
        input: 'BB337 7122 ',
        allowedOutputs: ['1']
      }]
    }, {
      id: 'SPECIAL_CHARACTERS',
      humanReadableName: 'special characters',
      testCases: [{
        input: 'test11@test',
        allowedOutputs: ['@']
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: 'meow',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'findFirstNonRepeatingCharacter'
    }]
  }]
};
