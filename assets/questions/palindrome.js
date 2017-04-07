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
    def createPalindromeString(cls, character_set, input_size):
        import random
        palindrome_str = ""
        while input_size > 0:
            character = random.choice(character_set)
            if input_size == 1:
                palindrome_str += character
                input_size -= 1
            else:
                palindrome_str = character + palindrome_str + character
                input_size -= 2
        return palindrome_str

    @classmethod
    def countNumberOfCharacters(cls, string):
        ascii_codes = {i:0 for i in range(255)}
        for character in string:
            ascii_codes[ord(character)] += 1

        numOddCharacters = 0
        for code in ascii_codes:
            if ascii_codes[code] % 2 is not 0:
                numOddCharacters += 1

        return ((len(string) % 2 == 0 and numOddCharacters == 0) or
                (len(string) % 2 == 1 and numOddCharacters == 1))

    @classmethod
    def forgetToIgnoreSpace(cls, string):
        for i in range(len(string)/2):
            if string[i] is not string[-i-1]:
                return False
        return True
`
  },
  tasks: [{
    instructions: [
      [
        'For this question, you will implement the isPalindrome function. ',
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
          'Are you sure the input string is a palindrome? \'abab\', for instance, is not.'
        ].join(''),
        [
          "It looks like you're counting the number of characters in the input string ",
          "and returning true if there are an even number of each. With strings ",
          "like 'abab', however, this approach doesn't work. Try to update your code ",
          "to avoid just counting the characters."
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
