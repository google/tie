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
    id: 'reverseWords',
    instructions: [{
      content: [
        'For this question, you\'ll implement the reverseWords function. ',
        'This function takes a string of words and reverses the individual ',
        'words, but it does not change the ordering of the words within the ',
        'sentence. A word consists of contiguous letters. Characters that are ',
        'not letters, such as whitespace and punctuation, should be ',
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
    languageSpecificTips: {
      python: [{
        regexString: 'import re|regex',
        message: 'You don\'t need to use regexes for this question.'
      }, {
        regexString: 'import',
        message: (
          'For this question, you do not need to import any Python libraries.')
      }]
    },
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
      id: 'WHITESPACE',
      humanReadableName: 'strings with lots of whitespace',
      testCases: [{
        input: 'hello    ',
        allowedOutputs: ['olleh    ']
      }, {
        input: '   hello',
        allowedOutputs: ['   olleh']
      }, {
        input: '  hello  ',
        allowedOutputs: ['  olleh  ']
      }, {
        input: 'hello  world',
        allowedOutputs: ['olleh  dlrow']
      }, {
        input: 'hello  hello   world',
        allowedOutputs: ['olleh  olleh   dlrow']
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
      id: 'NON_CONTIGUOUS_ASCII',
      humanReadableName: 'corner cases involving ASCII ranges',
      testCases: [{
        input: 'Hi[ John',
        allowedOutputs: ['iH[ nhoJ']
      }, {
        input: 'Hi] John',
        allowedOutputs: ['iH] nhoJ']
      }, {
        input: 'Hi^ John',
        allowedOutputs: ['iH^ nhoJ']
      }]
    }, {
      id: 'WEAK_ASCII_INEQUALITIES',
      humanReadableName: 'more corner cases involving ASCII ranges',
      testCases: [{
        input: 'Hi Antoine',
        allowedOutputs: ['iH eniotnA']
      }, {
        input: 'Hi antoine',
        allowedOutputs: ['iH eniotna']
      }, {
        input: 'Hi Zaphod',
        allowedOutputs: ['iH dohpaZ']
      }, {
        input: 'Hi zaphod',
        allowedOutputs: ['iH dohpaz']
      }]
    }, {
      id: 'NUMBERS',
      humanReadableName: 'cases involving numbers',
      testCases: [{
        input: 'Hi 007',
        allowedOutputs: ['iH 007']
      }, {
        input: 'H1 John',
        allowedOutputs: ['H1 nhoJ']
      }]
    }, {
      id: 'CORNER_CASES',
      humanReadableName: 'corner cases',
      testCases: [{
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
        input: '.',
        allowedOutputs: ['.']
      }, {
        input: '..,. !?',
        allowedOutputs: ['..,. !?']
      }, {
        input: '...hi',
        allowedOutputs: ['...ih']
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
      ignoredTestSuiteIds: [],
      messages: [
        'What value does your code return when given the input "Hello, John"?',
        [
          "It looks like your code isn't returning anything. Do you need to ",
          "add a return statement?"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnSampleOutput',
      ignoredTestSuiteIds: [],
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
      ignoredTestSuiteIds: [],
      messages: [
        [
          "You might have misinterpreted the question. Try verifying your ",
          "algorithm against the sample input/output to ensure you've ",
          "understood the question correctly -- it's generally a good idea to ",
          "do this in interviews before committing to an answer."
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
      ignoredTestSuiteIds: [],
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
      ignoredTestSuiteIds: [],
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
      ignoredTestSuiteIds: [],
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
      ignoredTestSuiteIds: [],
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
      ignoredTestSuiteIds: [],
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
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Adding spaces at ends of words to keep things simple is a nice ',
          'idea, but be careful about how you handle the extra space at the ',
          'end.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.treatAsciiCharsContiguously',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Check the ASCII tables -- are you sure that "A"-"z" can be ',
          'treated as a contiguous block of characters?'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.useWeakInequalitiesForCharValidity',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Are you correctly handling the check for whether a character is a ',
          'valid letter?'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.useWeakInequalitiesForCharValidity',
      ignoredTestSuiteIds: [],
      messages: [
        'Note that numbers should not be treated as English words.'
      ]
    }],
    suiteLevelTests: [{
      testSuiteIdsThatMustPass: [],
      testSuiteIdsThatMustFail: ['SAMPLE_INPUT'],
      messages: [
        [
          "That code doesn't seem to work as intended. Try taking a look at ",
          "the sample inputs and outputs, then walk through your code to see ",
          "what might be wrong."
        ].join('')
      ]
    }, {
      testSuiteIdsThatMustPass: ['SAMPLE_INPUT', 'GENERAL_CASE'],
      testSuiteIdsThatMustFail: ['WHITESPACE'],
      messages: [
        [
          'Be careful about whitespace: all spaces in the original string ',
          'should be left in place.'
        ].join(''),
        [
          'Note that spaces may occur in other places in the string, not just ',
          'between words.'
        ].join(''),
        [
          'Does your code correctly handle cases in which the space is at the ',
          'start or end of the string?'
        ].join('')
      ]
    }, {
      testSuiteIdsThatMustPass: ['SAMPLE_INPUT', 'GENERAL_CASE', 'WHITESPACE'],
      testSuiteIdsThatMustFail: ['PUNCTUATION'],
      messages: [
        [
          'Be careful about what constitues a "word". Punctuation should be ',
          'left in place, and not reversed along with the words.'
        ].join(''),
        [
          'You might have an incorrect test for what constitutes a "word ',
          'separator". Can you think of a better way to ensure that only ',
          'letters are left in place?'
        ].join('')
      ]
    }, {
      testSuiteIdsThatMustPass: ['SAMPLE_INPUT', 'GENERAL_CASE', 'WHITESPACE'],
      testSuiteIdsThatMustFail: ['CORNER_CASES'],
      messages: [
        [
          'It looks like your code is failing on some test cases. Try ',
          'stepping through a few sample inputs on paper to see if the output ',
          'your program produces is consistent with the expected output in ',
          'all cases.'
        ].join(''),
        [
          'It looks like there are still some corner cases that your code ',
          'doesn\'t handle. See if you can find the bug.'
        ].join(''),
        [
          'Try pretending that this code was written by someone else, and ',
          'think about different ways to break it. For example, perhaps the ',
          'string contains only punctuation, or it\'s empty -- there\'s at ',
          'least one case in which your code does not process the input ',
          'correctly. Make sure that your fix doesn\'t invalidate an already-',
          'passing test case, though!'
        ].join('')
      ]
    }],
    performanceTests: []
  }]
};
