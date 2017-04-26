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

globalData.questions['reverseWords'] = {  // eslint-disable-line dot-notation
  title: 'Reverse Words',
  starterCode: {
    python:
`def reverseWords(str):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def forgetLastWord(cls, s):
        result = ""
        reversed_word = []
        for c in s:
            if c.isspace():
                result += "".join(reversed(reversed_word))
                result += c
                reversed_word = []
            else:
                reversed_word.append(c)
        return result
`
  },
  tasks: [{
    instructions: [
      {
        content: [
          'For this question, you\'ll implement the reverseWords function. ',
          'This function takes a string of words separated by whitespace and ',
          'reverses the non-whitespace characters in the words, but not the ',
          'words\' ordering. It should also preserve the original whitespace.'
        ].join(''),
        type: 'text'
      },
      {
        content: 'Input: "moo cow bark dog"\nOutput: "oom woc krab god"',
        type: 'code'
      }
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'reverseWords',
    correctnessTests: [{
      input: 'moo cow bark dog',
      allowedOutputs: ['oom woc krab god']
    }, {
      input: 'racecar civic kayak mom noon level',
      allowedOutputs: ['racecar civic kayak mom noon level']
    }, {
      input: 'I',
      allowedOutputs: ['I']
    }, {
      input: '',
      allowedOutputs: ['']
    }, {
      input: 'ab',
      allowedOutputs: ['ba']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.forgetLastWord',
      messages: [
        "Try running your code on 'river ocean' on paper. What's the result?",
        "Are you sure that you're reversing all the words?",
        [
          "It looks like you're exiting the function without adding on the ",
          "last reversed word."
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      {
        content: [
          'Next, double-check your code to make sure that it preserves ',
          'the original whitespace and handles more than just letters.'
        ].join(''),
        type: 'text'
      }
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'reverseWords',
    correctnessTests: [{
      input: '   this  is \t a    whitespace  test',
      allowedOutputs: ['   siht  si \t a    ecapsetihw  tset']
    }, {
      input: '\t  ',
      allowedOutputs: ['\t  ']
    }, {
      input: '123 456 789 ',
      allowedOutputs: ['321 654 987 ']
    }, {
      input: 'test for dashes-and others',
      allowedOutputs: ['tset rof dna-sehsad srehto']
    }],
    buggyOutputTests: [],
    performanceTests: [{
      inputDataAtom: 'meow ',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'reverseWords'
    }]
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in a reverseWords function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
