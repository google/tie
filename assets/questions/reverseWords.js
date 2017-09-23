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
`def reverseWords(s):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def _reverseCorrectly(cls, s, isCharValid):
      result = ''
      reversed_word = ''
      for c in s:
        if isCharValid(c):
          result += reversed_word[::-1]
          result += c
          reversed_word = ''
        else:
          reversed_word += c
      if reversed_word:
        result += reversed_word[::-1]
      return result

    @classmethod
    def _reverseCorrectlyWithGivenDelimiters(cls, s, delimiters):
      return cls._reverseCorrectly(s, lambda x: x not in delimiters)

    @classmethod
    def returnNone(cls, s):
      return None

    @classmethod
    def returnSampleOutput(cls, s):
      return 'olleH, nhoJ'

    @classmethod
    def reverseString(cls, s):
      return s[::-1]

    @classmethod
    def returnOriginalString(cls, s):
      return s

    @classmethod
    def elideNonLetters(cls, s):
      result = ''
      for c in s:
        if c.isalpha():
          result += c
      return result[::-1]

    @classmethod
    def forgetLastWord(cls, s):
      result = ''
      reversed_word = ''
      for c in s:
        if not c.isalpha():
          result += reversed_word[::-1]
          result += c
          reversed_word = ''
        else:
          reversed_word += c
      return result

    @classmethod
    def forgetToReverseLastWord(cls, s):
      result = ''
      reversed_word = ''
      for c in s:
        if not c.isalpha():
          result += reversed_word[::-1]
          result += c
          reversed_word = ''
        else:
          reversed_word += c
      if reversed_word:
        result += reversed_word
      return result

    @classmethod
    def treatCommaAsPartOfWord(cls, s):
      return cls._reverseCorrectlyWithGivenDelimiters(s, [' '])

    @classmethod
    def addSpaceAtEnd(cls, s):
      return cls._reverseCorrectly(s + ' ', lambda x: x.isalpha())

    @classmethod
    def treatAsciiCharsContiguously(cls, s):
      return cls._reverseCorrectly(s, lambda x: 65 <= ord(x) <= 122)

    @classmethod
    def useWeakInequalitiesForCharValidity(cls, s):
      return cls._reverseCorrectly(
          s, lambda x: 65 < ord(x) < 90 or 97 < ord(x) < 122)

    @classmethod
    def treatsNumbersAsValidLetters(cls, s):
      return cls._reverseCorrectly(s, lambda x: isalpha(x) or isdigit(x))
`
  },
  tasks: [{
    instructions: [{
      content: [
        'For this question, you\'ll implement the reverseWords function. ',
        'This function takes a string of words and reverses the individual ',
        'words, but it does not change the ordering of the words within the ',
        'sentence. All the original whitespace/punctuation should be ',
        'preserved. Here\'s an example:'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "Hello, John"\nOutput: "olleH, nhoJ"',
      type: 'code'
    }],
    prerequisiteSkills: ['Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'reverseWords',
    testSuites: [{
      id: 'SAMPLE_INPUT',
      humanReadableName: 'the sample input',
      testCases: [{
        input: 'Hello, John',
        allowedOutputs: ['olleH, nhoJ']
      }]
    }, {
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'Hi, world',
        allowedOutputs: ['iH, dlrow']
      }, {
        input: 'Hello, world',
        allowedOutputs: ['olleH, dlrow']
      }, {
        input: 'Hey, how are you',
        allowedOutputs: ['yeH, woh era uoy']
      }]
    }, {
      id: 'LOTS_OF_WHITESPACE',
      humanReadableName: 'strings with lots of whitespace',
      testCases: [{
        input: '  hello  ',
        allowedOutputs: ['  olleh  ']
      }, {
        input: 'hello  world',
        allowedOutputs: ['olleh  dlrow']
      }, {
        input: 'hello    ',
        allowedOutputs: ['olleh    ']
      }]
    }, {
      id: 'PUNCTUATION',
      humanReadableName: 'strings with punctuation',
      testCases: [{
        input: 'Hi-- John',
        allowedOutputs: ['iH-- nhoJ']
      }, {
        input: 'Hi$ John',
        allowedOutputs: ['iH$ nhoJ']
      }, {
        input: 'Hi , John',
        allowedOutputs: ['iH , nhoJ']
      }, {
        input: '+one+two',
        allowedOutputs: ['+eno+owt']
      }, {
        input: 'Hello.goodbye',
        allowedOutputs: ['olleH.eybdoog']
      }]
    }, {
      id: 'CORNER_CASES',
      humanReadableName: 'corner cases',
      testCases: [{
        input: 'Hi[ John',
        allowedOutputs: ['iH[ nhoJ']
      }, {
        input: 'Hi Antoine',
        allowedOutputs: ['iH eniotnA']
      }, {
        input: 'Hi antoine',
        allowedOutputs: ['iH eniotna']
      }, {
        input: 'Hi Zaphod',
        allowedOutputs: ['iH dohpaZ']
      }, {
        input: 'Hi 007',
        allowedOutputs: ['iH 007']
      }, {
        input: 'H1 John',
        allowedOutputs: ['H1 nhoJ']
      }, {
        input: 'Hello',
        allowedOutputs: ['olleH']
      }, {
        input: 'hi',
        allowedOutputs: ['ih']
      }, {
        input: 'a',
        allowedOutputs: ['a']
      }, {
        input: 'A',
        allowedOutputs: ['A']
      }, {
        input: ' ',
        allowedOutputs: [' ']
      }, {
        input: '  ',
        allowedOutputs: ['  ']
      }, {
        input: '',
        allowedOutputs: ['']
      }, {
        input: '..,. !?',
        allowedOutputs: ['..,. !?']
      }, {
        input: '123',
        allowedOutputs: ['123']
      }, {
        input: 'hello,,, how are you?',
        allowedOutputs: ['olleh,,, woh era uoy?']
      }, {
        input: 'Hello.,.!?world',
        allowedOutputs: ['olleH.,.!?dlrow']
      }, {
        input: 'Hello---john',
        allowedOutputs: ['olleH---nhoj']
      }, {
        input: '...hello..goodbye...',
        allowedOutputs: ['...olleh..eybdoog...']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.returnNone',
      messages: [
        'What value does your code return when given the input "Hello, John"?',
        [
          "It looks like your code isn't returning anything. Do you need to ",
          "add a return statement?"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnSampleOutput',
      messages: [
        [
          'Your code should work in the general case, not just the one given ',
          'in the sample input/output.'
        ].join(''),
        [
          'Looks like your code always returns the same result, even for ',
          'different input strings! However, the code needs to work ',
          'correctly for any input string.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.reverseString',
      messages: [
        [
          "Try reading the question again, and looking at the sample ",
          "input/output -- it's asking for something different."
        ].join(''),
        [
          'For the sample input "Hello, John", the expected output is "olleH, ',
          'nhoJ". Can you verify the first letter of the return value ',
          'produced by your code?'
        ].join(''),
        [
          'The question asks to reverse each individual word in the string, ',
          'but preserve the order of the words. However, it looks like your ',
          'code is reversing the entire string...'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnOriginalString',
      messages: [
        [
          'Try running your algorithm, by hand, on the sample input. Does it ',
          'give the right answer?'
        ].join(''),
        [
          'When your code is run with "Hello, John", where does the "H" at ',
          'the beginning end up?'
        ].join(''),
        [
          'Your code seems to be returning the original input string. There ',
          'may be a bug in your algorithm for reversing a string -- try ',
          'tracing through just that part of the code with a single word and ',
          'seeing what the output is.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.elideNonLetters',
      messages: [
        [
          'Try running your algorithm, by hand, on the sample input. Does it ',
          'give the right answer?'
        ].join(''),
        [
          "Please check that you're handling spaces correctly."
        ].join(''),
        [
          'Spaces and punctuation need to be preserved. If there is a space ',
          'between two words in the input, there should also be a space ',
          'between those words in the output.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.forgetLastWord',
      messages: [
        [
          'Try running your algorithm, by hand, on the sample input. Does it ',
          'give the right answer?'
        ].join(''),
        [
          "It looks like you're returning too few words. Did you forget to ",
          "add the last one?"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.forgetToReverseLastWord',
      messages: [
        [
          'Try running your algorithm, by hand, on the sample input. Does it ',
          'give the right answer?'
        ].join(''),
        [
          'When your code is run with "Hello, John", where does the last ',
          'character end up?'
        ].join(''),
        'Looks like you may have forgotten to reverse the last word...'
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.treatCommaAsPartOfWord',
      messages: [
        [
          'When you run your algorithm with "Hello, John", what is the first ',
          'character in the output? Is it correct?'
        ].join(''),
        [
          'Remember, per the question, that commas, spaces, etc. should be ',
          'left in place.'
        ].join(''),
        [
          'Your code seems to treat "Hello," as one word, but the comma at ',
          'the end is not part of the word.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.addSpaceAtEnd',
      messages: [
        [
          'Adding spaces at ends of words to keep things simple is a nice ',
          'idea, but be careful about how you handle the extra space at the ',
          'end.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.treatAsciiCharsContiguously',
      messages: [
        [
          'Check the ASCII tables -- are you sure that "A"-"z" can be ',
          'treated as a contiguous block of characters?'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.useWeakInequalitiesForCharValidity',
      messages: [
        [
          'Are you correctly handling the check for whether a character is a ',
          'valid letter?'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.useWeakInequalitiesForCharValidity',
      messages: [
        'Note that numbers should not be treated as English words.'
      ]
    }],
    performanceTests: []
  }]
};
