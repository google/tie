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
    def onlyUseOneLetterInResult(cls, word):
        longest = ''
        for i in range(len(word)):
          diff = False
          for j in range(i, len(word)):
            if word[j] != word[i]:
              diff = True
              break
          if diff:
            j -= 1
          if len(longest) < (j - i + 1):
            longest = word[i:(j + 1)]
        return longest
`
  },
  tasks: [{
    id: 'findLongestSubstring',
    instructions: [{
      content: [
        "For this problem, you'll be writing a longestSubstring method ",
        'that, given a string, finds the longest substring (continous ',
        'sequence of characters) that contains at ',
        'most 2 distinct characters.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Input: "cababadadad"',
        'Output: "adadad"'
      ].join('\n'),
      type: 'code'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'longestSubstring',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'ababcbcbaaabbdef',
        allowedOutputs: ['baaabb']
      }, {
        input: 'abcbbcbcbb',
        allowedOutputs: ['bcbbcbcbb']
      }, {
        input: 'cababadadad',
        allowedOutputs: ['adadad']
      }]
    }, {
      id: 'FEW_DISTINCT_CHARACTERS',
      humanReadableName: 'strings with at most 2 distinct characters',
      testCases: [{
        input: 'bbbbbbbb',
        allowedOutputs: ['bbbbbbbb']
      }, {
        input: 'ab',
        allowedOutputs: ['ab']
      }, {
        input: 'abbba',
        allowedOutputs: ['abbba']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.onlyUseOneLetterInResult',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Try running your code on the input, "abbabbabb". ',
          'Is the result what you expected?'
        ].join(''),
        'How many types of characters appear in your solution?',
        [
          'For a string that has at least two types of characters, ',
          'the result should have two types of characters, as well. ',
          "For example, 'abbba' should return 'abbba', not 'bbb'."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: 'oooyyoxaoo',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'longestSubstring'}]
  }]
};
