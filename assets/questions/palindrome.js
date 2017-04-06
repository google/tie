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
 * @fileoverview Question data for Valid Palindrome.
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
    def countNumberOfChar(cls, s):
        ascii_codes = {i:0 for i in range(255)}
        for chr in s:
            ascii_codes[ord(chr)] += 1
        for code in ascii_codes:
            if ascii_codes[code] % 2 is not 0:
                return False
        return True

    @classmethod
    def forgetIgnoreSpace(cls, s):
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
        'It takes a word as input and return True if the input word is a ',
        'palindrome and False if it is not. A palindrom is a word, phrase, ',
        'or sequence that reads the same backward as forward, e.g., \'madam\' ',
        'or \'nurses run\'. Note, the input string would only consist by ',
        'alphabets from a-z and space.'
      ].join('')
    ],
    prerequisiteSkills: ['Strings', 'String Manipulation'],
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
      buggyFunctionName: 'AuxiliaryCode.countNumberOfChar',
      messages: [
        "Try running your code on 'abab' on paper. Did you expet that result?",
        [
          'Are you sure the sentence is actually palindrom? \'abba\' is palindrom, ',
          'but \'abab\' is not.'
        ].join(''),
        [
          "It looks like you're counting the number of character of the input string, ",
          "and if you have the even number of each kind, returning true. That's not ",
          "quite correct. See if you can figure out why."
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.forgetIgnoreSpace',
      messages: [
        "Try running your code on 'nurses run' on paper. Did you expect that result?",
        [
          'Try harder for cases with spaces. \'nurses run\' is palindrom, ',
          'and \'a b   cba\' is also a palindrom'
        ].join(''),
        [
          'It looks like you does not ignore spaces in the sentence. By definition, spaces ',
          'are usually ignored. See if you can change some of your code to make it pass.'
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
