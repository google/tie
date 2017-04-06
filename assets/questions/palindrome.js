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
 * @fileoverview Question data for Balanced Palindrome.
 */

globalData.questions['palindrome'] = {  // eslint-disable-line dot-notation
  title: 'Balanced Palindrome',
  starterCode: {
    python:
`def isPalindrome(s):
    return False
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def createPalindromeString(cls, chr_set, input_size):
        import random
        ret = ""
        while input_size > 0:
            chr = random.choice(chr_set)
            if input_size == 1:
                ret += chr
                input_size -= 1
            else:
                ret = chr + ret + chr
                input_size -= 2
        return ret

    @classmethod
    def countNumberOfCharacters(cls, s):
        ascii_codes = {i:0 for i in range(255)}
        for chr in s:
            ascii_codes[ord(chr)] += 1

        odd_cnt = 0
        for code in ascii_codes:
            if ascii_codes[code] % 2 is not 0:
                odd_cnt += 1

        if len(s) % 2 == 0 and odd_cnt == 0:
            return True
        elif len(s) % 2 == 1 and odd_cnt == 1:
            return True
        return False

    @classmethod
    def forgetToIgnoreSpace(cls, s):
        for i in range(len(s)/2):
            if s[i] is not s[-i-1]:
                return False
        return True
`
  },
  tasks: [{
    instructions: [
      [
        'For this question, you will implement the isPalindrom function. ',
        'It takes a sentense as input and return True if the input is a ',
        'palindrome and False if it is not.'
      ].join(''),
      [
        'A palindrome is a word, phrase, or sequence that reads the same ',
        'backward as forward, e.g., \'madam\' or \'nurses run\'.'
      ].join(''),
      'Note that the input string will consist of lowercase letters (a-z) and spaces.'
    ],
    prerequisiteSkills: ['String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'isPalindrome',
    correctnessTests: [{
      input: '',
      allowedOutputs: [true]
    }, {
      input: 'nurses run',
      allowedOutputs: [true]
    }, {
      input: 'a b   cba',
      allowedOutputs: [true]
    }, {
      input: 'abcdcba',
      allowedOutputs: [true]
    }, {
      input: 'abccba',
      allowedOutputs: [true]
    }, {
      input: 'abab',
      allowedOutputs: [false]
    }, {
      input: 'stressed desserts',
      allowedOutputs: [true]
    }, {
      input: 'dioramas is samaroid',
      allowedOutputs: [false]
    }, {
      input: 'dioramas is si samaroid',
      allowedOutputs: [true]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.countNumberOfCharacters',
      messages: [
        "Try running your code on 'abab' on paper. Did you expet that result?",
        [
          'Are you sure the input string is palindrome? \'abab\', for instance, is not.'
        ].join(''),
        [
          "number of characters in the input string and returning true if ",
          "there are an even number of each. With strings like 'abab', however, ",
          "this approach doesn't work. Try to update your code to avoid just ",
          "counting the characters."
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.forgetToIgnoreSpace',
      messages: [
        "Try running your code on 'nurses run' on paper. Did you expect that result?",
        [
          'What happens if your input string contains spaces?'
        ].join(''),
        [
          'It looks like you\'re not ignoring spaces in the input string. ',
          'Try to update your code to skip over spaces when determining if ',
          'a string is a palindrome'
        ].join('')
      ]
    }],
    performanceTests: [{
      inputDataAtom: 'abcdefghijklmnopqrstuvwxyz',
      transformationFunctionName: 'AuxiliaryCode.createPalindromeString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'isPalindrome'
    }]
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      "You should only be writing code in an isPalindrome function. While ",
      "decomposition is generally a good idea, you shouldn't need more than ",
      "just this function for this question."
    ].join('')
  }]
};
