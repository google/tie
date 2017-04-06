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

globalData.questions['mostCommonChar'] = {  // eslint-disable-line dot-notation
  title: 'Most Common Character',
  starterCode: {
    python:
`def findMostCommonChar(s):
    return ""
`
  },
  auxiliaryCode: {
    python:
`from collections import Counter
class AuxiliaryCode(object):
    @classmethod
    def lettersOnly(cls, word):
      if word == "":
        return ""
      word = [w for w in word if w.isalpha()]
      counter = Counter(word)
      result = word[0]
      for w in counter:
        if counter[w] > counter[result]: result = w
      return w
`
  },
  tasks: [{
    instructions: [
      [
        "For this problem, we'd like you to write a method to determine",
        'the most common character in a string You will be given a string',
        'of ASCII characters, and you may assume that there',
        ' is only one most common character, for now.'
      ].join(''),
      "There's no need to validate that you're always passed a string"
    ],
    prerequisiteSkills: ['String', 'String Manipulation', 'Array'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findMostCommonChar',
    correctnessTests: [{
      input: '',
      allowedOutputs: ['']
    }, {
      input: 'apoiuytrewqsdf*&^%$#ba',
      allowedOutputs: ['a']
    }, {
      input: 'aBBB4562873ba',
      allowedOutputs: ['B']
    }, {
      input: 'babaabb',
      allowedOutputs: ['b']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.lettersOnly',
      messages: [
        'Did you consider alphabetic characters only?'
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Now, check to make sure that your code works for',
        'different string encodings.',
        'What if the provided string is unicode, rather than ASCII?'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'Hash Maps'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findMostCommonChar',
    correctnessTests: [{
      input: '\u0041\u0042\u0043\u0041',
      allowedOutputs: ['A']
    }],
    buggyOutputTests: [],
    performanceTests: [{
      inputDataAtom: 'abbac',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'findMostCommonChar'
    }]
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in a findMostCommonChar function. ',
      "While decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
