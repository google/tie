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

globalData.questions['common'] = {  // eslint-disable-line dot-notation
  title: 'Most Common Character',
  starterCode: {
    python:
`def findMostCommonChar(s):
    return ""
`
  },
  tasks: [{
    instructions: [
      [
	"Find the most common character of a string, as described in title. ",
	"Assume that the string is ASCII, and there's only one most common character. ",
	"Consider that the answer is unique for now."
      ].join(''),
      [
        "We will guarantee that you will always be passed a string, so ",
        "you don't have to take care of integrity check."
      ].join('')
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
      input: 'abb4562873ba',
      allowedOutputs: ['b']
    }, {
      input: 'babaabb',
      allowedOutputs: ['b']
    }],
    buggyOutputTests: [],
    performanceTests: []
  }, {
    instructions: [
        "What if only 6 characters or less can possibly occur in the string?"
    ],
    prerequisiteSkills: ['Strings', 'String Manipulation', 'HashMap'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findMostCommonChar',
    correctnessTests: [{
      input: 'aba',
      allowedOutputs: ['a']
    }, {
      input: 'baa',
      allowedOutputs: ['a']
    }, {
      input: 'ababa',
      allowedOutputs: ['a']
    }],
    buggyOutputTests: [],
    performanceTests: []
  }, {
    instructions: [
      [
        'What if now the string is unicode instead of ASCII?'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'Hashmap'],
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
      inputDataAtom: 'abbac ',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'findMostCommonChar'
    }]
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      "You should only be writing code in an findMostCommonChar function. While ",
      "decomposition is generally a good idea, you shouldn't need more than ",
      "just this function for this question."
    ].join('')
  }]
};
