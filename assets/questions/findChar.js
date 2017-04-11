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

globalData.questions['findChar'] = { // eslint-disable-line dot-notation
  title: 'Find the First Non-Repeating Character in a String',
  starterCode: {
    python: `def findFirstNonRepeatingCharacter(word):
    return ""
`
  },
  auxiliaryCode: {
    python: `class AuxiliaryCode(object):
    @classmethod
    def sortCharactersInString(cls, word):
        sortedStr = ''.join(sorted(word))        
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
        [
          'For this question, you will implement a findFirstNonRepeatingCharacter function. ',
          'This function takes a string as input and returns the first character that isn\'t repeated elsewhere in the string.'
        ].join(''),
        'For instance, findFirstNonRepeatingCharacter("mom") would return "o".',
        'If there is no appropriate character, return None.'
      ],
      prerequisiteSkills: ['Strings'],
      acquiredSkills: ['String Manipulation', 'Hash Maps'],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'findFirstNonRepeatingCharacter',
      correctnessTests: [
        {input: 'mom',
          allowedOutputs: ['o']},
        {input: 'apple',
          allowedOutputs: ['a']},
        {input: 'wefffa',
          allowedOutputs: ['w']},
        {input: 'weffwa',
          allowedOutputs: ['e']},
        {input: '',
          allowedOutputs: [null]},
        {input: 'aaaeee',
          allowedOutputs: [null]}
      ],
      buggyOutputTests: [{
        buggyFunctionName: 'AuxiliaryCode.sortCharactersInString',
        messages: [
          'Try running your code on \'wefffa\' on paper. What\'s the result?',
          'Are you sure that you\'re returning the first non-repeating character in the word?',
          'It looks like you\'re returning a unique character, but you\'re not returning the first one in the provided string.'
        ]
      }],
      performanceTests: []
    },
    {
      instructions: [[
        'Next, double-check your code to make sure that it handles ',
        'more than just letters.'
      ].join('')],
      prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
      acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'findFirstNonRepeatingCharacter',
      correctnessTests: [
        {input: 'TT AsAs',
          allowedOutputs: [' ']},
        {input: 'AbCABcBb',
          allowedOutputs: ['C']},
        {input: 'BB337 7122 ',
          allowedOutputs: ['1']},
        {input: 'test11@test',
          allowedOutputs: ['@']}
      ],
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
      'You should only be writing code in a findFirstNonRepeatingCharacter function. While ',
      'decomposition is generally a good idea, you shouldn\'t need more than ',
      'just this function for this question.'
    ].join('')
  }]
};
