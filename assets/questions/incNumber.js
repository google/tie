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
 * @fileoverview Question data for incrementDecCodedNumber.
 */


/* eslint no-magic-numbers: ["error", 
                            { "ignore": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }] */

globalData.questions['incNumber'] = {  // eslint-disable-line dot-notation
  title: 'Increment a Decimal-Coded Number',
  starterCode: {
    python:
`def incrementDecCodedNumber(digits):
    return []
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def createDigits(cls, atom, input_size):
        result = []
        for i in xrange(input_size):
          result.append(int(atom))
        return result

    @classmethod
    def incrementLastDigitOnly(cls, digits):
        digits_input = [x for x in digits]
        digits_input[-1] += 1
        return digits_input

    @classmethod
    def incrementWithoutChangeSize(cls, digits):
        digits_input = [x for x in digits]
        digits_input[-1] = (digits_input[-1] + 1) % 10
        carry = False
        if digits_input[-1] == 0:
            carry = True
        for i in xrange(len(digits_input)-2, -1, -1):
            if carry == False:
                break
            digits_input[i] = (digits_input[i] + 1) % 10
            if digits_input[i] != 0:
                carry = False

        return digits_input
`
  },
  tasks: [{
    instructions: [
      [
        'Implement a function for increment a decimal-coded number. A ',
        'Decimal-Coded number is a list of digits (0 - 9) which can represent ',
        'a decimal number, such as [1,2] for 12, [3,2,4] for 324. ',
        'Your task is to increment a given decimal-coded number and return the ',
        'result (a list of digits). ',
        'For example, [1,2,3,4] should become to [1,2,3,5], [2,0,9] should ',
        'become to [2,1,0]. '
      ].join('')
    ],
    prerequisiteSkills: ['Arrays'],
    acquiredSkills: ['Array Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'incrementDecCodedNumber',
    correctnessTests: [{
      input: [1, 2, 3, 4], 
      allowedOutputs: [[1, 2, 3, 5]]
    }, {
      input: [2, 0, 9], 
      allowedOutputs: [[2, 1, 0]]
    }, {
      input: [0], 
      allowedOutputs: [[1]]
    }, {
      input: [1, 9, 9], 
      allowedOutputs: [[2, 0, 0]]
    }], 
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.incrementLastDigitOnly',
      messages: [
        "Try running your code on [1,9] in your head. What's the result?.",
        [
          "You seem to increment the last digit only without any mathematical carry. ",
          "Is it the correct way?"
        ].join(''),
        [
          "Make sure to modify other digits when there is a carrying."
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Great! Now your code can handle the case that incrementing will ',
        'cause mathematical carry. Next, modify your code to handle the ',
        'the input which may change the number of digits when incrementing.'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays'],
    acquiredSkills: ['Array Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'incrementDecCodedNumber',
    correctnessTests: [{
      input: [1, 2, 3, 4], 
      allowedOutputs: [[1, 2, 3, 5]]
    }, {
      input: [2, 0, 9], 
      allowedOutputs: [[2, 1, 0]]
    }, {
      input: [0], 
      allowedOutputs: [[1]]
    }, {
      input: [9], 
      allowedOutputs: [[1, 0]]
    }, {
      input: [1, 9, 9], 
      allowedOutputs: [[2, 0, 0]]
    }, {
      input: [9, 9, 9, 9], 
      allowedOutputs: [[1, 0, 0, 0, 0]]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.incrementWithoutChangeSize',
      messages: [
        [
          "Think about how your code handles edge cases. ",
          "When incrementing [9], then answer should be [1,0]."
        ].join('')
      ]
    }],
    performanceTests: [{
      inputDataAtom: '9',
      transformationFunctionName: 'AuxiliaryCode.createDigits',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'incrementDecCodedNumber'
    }]
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      "You should only be writing code in an abbreviate function. While ",
      "decomposition is generally a good idea, you shouldn't need more than ",
      "just this function for this question."
    ].join('')
  }]
};
