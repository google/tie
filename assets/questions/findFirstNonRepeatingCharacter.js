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
  tasks: [
    {
      instructions: [
        {
          content: [
            'For this question, you will implement a ',
            'findFirstNonRepeatingCharacter function. ',
            'This function takes a string as input and returns ',
            'the first character that isn\'t repeated elsewhere in the string.'
          ].join(''),
          type: 'text'
        },
        {
          content: 'Input: "mom"\nOutput: "o"',
          type: 'code'
        },
        {
          content: 'If there is no appropriate character, return None.',
          type: 'text'
        }
      ],
      prerequisiteSkills: ['Strings'],
      acquiredSkills: ['String Manipulation', 'Hash Maps'],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'findFirstNonRepeatingCharacter',
      correctnessTests: [{
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
      }, {
        input: '',
        allowedOutputs: [null]
      }, {
        input: 'aaaeee',
        allowedOutputs: [null]
      }],
      buggyOutputTests: [{
        buggyFunctionName: 'AuxiliaryCode.sortCharactersInString',
        messages: [
          [
            'Try running your code on \'wefffa\' on paper. What\'s the result?'
          ].join(''),
          'It looks like you\'re returning a unique character, ',
          'but it is not the first one in the provided string.'
        ]
      }],
      performanceTests: []
    },
    {
      instructions: [
        {
          content: [
            'Next, update your code to handle more than just letters.',
            'more than just letters.'
          ].join(''),
          type: 'text'
        }
      ],
      prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
      acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'findFirstNonRepeatingCharacter',
      correctnessTests: [{
        input: 'TT AsAs',
        allowedOutputs: [' ']
      }, {
        input: 'AbCABcBb',
        allowedOutputs: ['C']
      }, {
        input: 'BB337 7122 ',
        allowedOutputs: ['1']
      }, {
        input: 'test11@test',
        allowedOutputs: ['@']
      }],
      buggyOutputTests: [],
      performanceTests: [{
        inputDataAtom: 'meow',
        transformationFunctionName: 'System.extendString',
        expectedPerformance: 'linear',
        evaluationFunctionName: 'findFirstNonRepeatingCharacter'
      }]
    }
  ],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in a findFirstNonRepeatingCharacter',
      'function. While decomposition is generally a good idea, ',
      'you shouldn\'t need more than just this function for this question.'
    ].join('')
  }]
};
