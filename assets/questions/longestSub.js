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
 * @fileoverview Question data for longest substring with at most two distinct 
 * characters problem.
 */

globalData.questions['longestSubstring'] = {  // eslint-disable-line dot-notation
  title: 'Longest Substring With At Most Two Distinct Characters',
  starterCode: {
    python:
`def longestSubstring(str):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def oneLetterResult(cls, word):
        longest = ''
        for i in range(len(word)):
          diff = False
          for j in range(i, len(word)):
            if word[j] != word[i]:
              diff = True;
              break;
          if diff:
            j = j-1
          if len(longest) < j-i+1:
            longest = word[i:j+1];
        return longest
`
  },
  tasks: [{
    instructions: [
      [
        "For this problem, you'll be writing a longestSubstring method that, given a string",
        ', finds the longest substring that contains at most 2 distinct characters.',
        'For instance, the string "cababadadad" would return "adadad" as its longest substring.'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'longestSubstring',
    correctnessTests: [{
      input: 'ababcbcbaaabbdef',
      allowedOutputs: ['baaabb']
    }, {
      input: 'abcbbcbcbb',
      allowedOutputs: ['bcbbcbcbb']
    }, {
      input: 'ab',
      allowedOutputs: ['ab']
    }, {
      input: 'cababadadad',
      allowedOutputs: ['adadad']
    }, {
      input: 'abbba',
      allowedOutputs: ['abbba']
    }
    ], 
    buggyOutputTests: [
      {
        /** This test is when provided with a multiple-character string, 
         * the student's result only yield a substring that has one 
         * type of character. This means it is incorrect
        */
        buggyFunctionName: 'AuxiliaryCode.oneLetterResult',
        messages: [
          ["For a string that has more than one type of character, the result should have at least two types of characters",
            "For example, 'abbba' should yield the result of 'abbba' and not 'bbb'"].join('.')
        ]
      }
    ],
    performanceTests: [{
      inputDataAtom: 'o',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'longestSubstring'}]
  }
  ],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in an longestSubstring function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
