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

globalData.questions['plusone'] = {  // eslint-disable-line dot-notation
  title: 'Increment a decimal-coded number',
  starterCode: {
    python:
`def increment(s):
    return '0'
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def foo(cls, array):
        return none
`
  },
  tasks: [{
    instructions: [
      [
        'Given a number represented as a string, increment it.'
      ].join(''),
      "For instance, '2788' would become '2789'."
    ],
    prerequisiteSkills: ['Arrays', 'Math', 'String Manipulation'],
    acquiredSkills: ['Arrays', 'String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'increment',
    correctnessTests: [{
      input: '2788',
      allowedOutputs: ['2789']
    },
    {
      input: '0',
      allowedOutputs: ['1']
    },
    {
      input: '8',
      allowedOutputs: ['9']
    },
    {
      input: '15',
      allowedOutputs: ['16']
    },
    {
      input: '235',
      allowedOutputs: ['236']
    },
    {
      input: '2789',
      allowedOutputs: ['2790']
    },
    {
      input: '3999',
      allowedOutputs: ['4000']
    },
    {
      input: '9999',
      allowedOutputs: ['10000']
    }],
    buggyOutputTests: [],
    performanceTests: [{
      inputDataAtom: '139',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'increment'
    }]
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in a increment function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
