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

globalData.questions['findMostCommonCharacter'] = {  // eslint-disable-line dot-notation
  title: 'Most Common Character',
  starterCode: {
    python:
`def findMostCommonCharacter(s):
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
        if counter[w] > counter[result]:
          result = w
      return w
`
  },
  tasks: [{
    instructions: [{
      content: [
        'For this problem, we\'d like you to write a method to determine ',
        'the most common character in a string. You will be given a string ',
        'of ASCII characters, and you may assume that there ',
        'is only one most common character, ignoring spaces.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "doggo pupper"\nOutput: "p"',
      type: 'code'
    }, {
      content: [
        'There\'s no need to validate that you\'re always passed a string.'
      ].join(''),
      type: 'text'
    }],
    prerequisiteSkills: ['String Manipulation', 'Arrays'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findMostCommonCharacter',
    correctnessTests: [{
      input: 'cdcdc',
      allowedOutputs: ['c'],
      tag: 'the general case'
    }, {
      input: 'babaabb',
      allowedOutputs: ['b'],
      tag: 'the general case'
    }, {
      input: 'aBBB4562873ba',
      allowedOutputs: ['B'],
      tag: 'strings with numbers'
    }, {
      input: 'apoiuytrewqsdf*&^%$#ba',
      allowedOutputs: ['a'],
      tag: 'strings with special characters'
    }, {
      input: 'x',
      allowedOutputs: ['x'],
      tag: 'small inputs'
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.lettersOnly',
      messages: [
        [
          "Try running your code on '1600Amphitheatre'. ",
          "Do you get the result you expected?"
        ].join(''),
        "What happens if you pass in strings that contain numbers?",
        [
          "It looks like you are not handling strings properly ",
          "if they contain digits or special characters, ",
          "such as '0123456789' or '~?!@#$%'."
        ].join('')
      ]
    }],
    performanceTests: [{
      inputDataAtom: 'abbac',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'findMostCommonCharacter'
    }]
  }]
};
