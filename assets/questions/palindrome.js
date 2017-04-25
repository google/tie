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
 * @fileoverview Question data for Is Palindrome.
 */

globalData.questions['palindrome'] = {  // eslint-disable-line dot-notation
  title: 'Is Palindrome',
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
    def createPalindrome(cls, character_set, input_size):
        import random

        number_of_spaces = random.randint(0, input_size)
        number_of_characters = input_size - number_of_spaces

        palindrome = []
        if number_of_characters % 2 != 0:
            palindrome = [random.choice(character_set)]
            number_of_characters -= 1

        while number_of_characters > 0:
            character = random.choice(character_set)
            palindrome = [character] + palindrome + [character]
            number_of_characters -= 2

        for i in range(number_of_spaces):
            position = random.randint(0, len(palindrome))
            palindrome.insert(position, ' ')

        return ''.join(palindrome)

    @classmethod
    def countNumberOfCharacters(cls, string):
        ascii_codes = {i:0 for i in range(255)}
        for character in string:
            ascii_codes[ord(character)] += 1

        num_odd_characters = 0
        for code in ascii_codes:
            if ascii_codes[code] % 2 != 0:
                num_odd_characters += 1

        return ((len(string) % 2 == 0 and num_odd_characters == 0) or
                (len(string) % 2 == 1 and num_odd_characters == 1))

    @classmethod
    def forgetToIgnoreSpaces(cls, string):
        for i in range(len(string) / 2):
            if string[i] is not string[-i - 1]:
                return False
        return True
`
  },
  tasks: [{
    instructions: [
      {
        content: [
          'For this question, you will implement the isPalindrome function. ',
          'It takes a sentence as input and returns True if the input is a ',
          'palindrome and False if it is not.'
        ].join(''),
        type: 'text'
      },
      {
        content: [
          'A palindrome is a word, phrase, or sequence that reads the same ',
          'backward as forward, e.g., "madam" or "nurses run".'
        ].join(''),
        type: 'code'
      },
      {
        content: [
          'Note that the input string will consist of lowercase letters (a-z) ',
          'and spaces.'
        ].join(''),
        type: 'text'
      }
    ],
    prerequisiteSkills: ['String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'isPalindrome',
    correctnessTests: [{
      input: '',
      allowedOutputs: [true],
      tag: 'empty strings'
    }, {
      input: 'nurses run',
      allowedOutputs: [true],
      tag: 'strings with spaces'
    }, {
      input: 'a b   cba',
      allowedOutputs: [true],
      tag: 'strings with spaces'
    }, {
      input: 'abcdcba',
      allowedOutputs: [true],
      tag: 'the general case'
    }, {
      input: 'abccba',
      allowedOutputs: [true],
      tag: 'the general case'
    }, {
      input: 'abab',
      allowedOutputs: [false],
      tag: 'the general case'
    }, {
      input: 'stressed desserts',
      allowedOutputs: [true],
      tag: 'strings with spaces'
    }, {
      input: 'dioramas is samaroid',
      allowedOutputs: [false],
      tag: 'strings with spaces'
    }, {
      input: 'dioramas is si samaroid',
      allowedOutputs: [true],
      tag: 'strings with spaces' 
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.countNumberOfCharacters',
      messages: [
        [
          'Try running your code on \'abab\' on paper. Did you expect that',
          'result?'
        ].join(''),
        [
          'Are you sure the input string is a palindrome? \'abab\', for ',
          'instance, is not.'
        ].join(''),
        [
          'It looks like you\'re counting the number of characters in the ',
          'input string and returning true if there are an even number of ',
          'each type of character. With strings like \'abab\', however, ',
          'this approach doesn\'t work. Try to update your code to avoid ',
          'just counting the characters.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.forgetToIgnoreSpace',
      messages: [
        [
          'Try running your code on \'nurses run\' on paper. Did you ',
          'expect that result?'
        ].join(''),
        'What happens if your input string contains spaces?',
        [
          'It looks like you\'re not ignoring spaces in the input string. ',
          'Try to update your code to skip over spaces when determining if ',
          'a string is a palindrome.'
        ].join('')
      ]
    }],
    performanceTests: [{
      inputDataAtom: 'abcdefghijklmnopqrstuvwxyz',
      transformationFunctionName: 'AuxiliaryCode.createPalindrome',
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
