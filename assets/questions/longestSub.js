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
 * @fileoverview Question data for Run-Length Encoding.
 */

globalData.questions['longestSub'] = {  // eslint-disable-line dot-notation
  title: 'Run-Length Encoding',
  starterCode: {
    python:
`def longestSubstring(seq):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def skipEncodingAtEndOfString(cls, word):
        return None
`
  },
  tasks: [{
    instructions: [
      [
        'Given a string, find the longest substring that contains at most 2 distinct characters.'
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
      input: 'rspbbvueyturpzmxltbnccqqhudcbtumwbflpdrqbsxiolccbeizrbvrjmwunblhtegmpgoawywmpmmvqlkuameudwpaolblwfkk',
      allowedOutputs: ['ccqq', 'mpmm']
    }
    ], 
    buggyOutputTests: [],
    performanceTests: [{inputDataAtom: 'o',
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
