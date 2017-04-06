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
 * @fileoverview Question data for Reverse Words.
 */

globalData.questions['findChar'] = { // eslint-disable-line dot-notation
  title: 'Find the first character in a string that doesn\'t repeat',
  starterCode: {
    python: `def find1stNonRepeatedChar(word):
    return ""
`
  },
  auxiliaryCode: {
    python: `class AuxiliaryCode(object):
    @classmethod
    def sortChar(cls, word):
        sortedStr = ''.join(sorted(word))        
        c = [a for a in sortedStr if sortedStr.count(a) == 1]
        if not c:
            return None
        else:
            return c[0]
`
  },
  tasks: [
    {
      instructions: [
        [
          'For this question, you\'ll implement the find1stNonRepeatedChar function. ',
          'Write a function to find the first character in a String that doesn\'t repeat.'
        ].join(''),
        'For instance, \'mom\' would output \'o\'.'
      ],
      prerequisiteSkills: ['Strings', 'String Manipulation'],
      acquiredSkills: ['String Manipulation'],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'find1stNonRepeatedChar',
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
        buggyFunctionName: 'AuxiliaryCode.sortChar',
        messages: [[
          'Try running your code on \'wefffa\' on paper. What\'s the result?   ',
          'Are you sure that you\'re returning the first non-repeating character in the word?   ',
          'It looks like you\'re returning the character that is unique but not the first one in the given string.'
        ].join('')]
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
      mainFunctionName: 'find1stNonRepeatedChar',
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
        inputDataAtom: 'meow ',
        transformationFunctionName: 'System.extendString',
        expectedPerformance: 'linear',
        evaluationFunctionName: 'find1stNonRepeatedChar'
      }]
    }
  ],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in a find1stNonRepeatedChar function. While ',
      'decomposition is generally a good idea, you shouldn\'t need more than ',
      'just this function for this question.'
    ].join('')
  }]
};
