// Copyright 2018 The TIE Authors. All Rights Reserved.
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
 * @fileoverview Question data for Pirate Translator.
 */

globalData.questions['pirateTranslator'] = {  // eslint-disable-line dot-notation
  title: 'Translate English to Pirate',
  starterCode: {
    python:
`def translateToPirate(s):
    # English to Pirate is:
    #    sir -> matey
    #    hotel -> fleabag inn
    #    student -> swabbie
    #    boy -> matey
    #    madam -> proud beauty
    #    professor -> foul blaggard
    #    restaurant -> galley
    #    your -> yer
    #    excuse -> arr
    #    students -> swabbies
    #    are -> be
    #    lawyer -> foul blaggard
    #    the -> th'
    #    restroom -> head
    #    my -> me
    #    hello -> avast
    #    is -> be
    #    man -> matey
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
  ENGLISH_TO_PIRATE = {
    "sir": "matey",
    "hotel": "fleabag inn",
    "student": "swabbie",
    "boy": "matey",
    "madam": "proud beauty",
    "professor": "foul blaggard",
    "restaurant": "galley",
    "your": "yer",
    "excuse": "arr",
    "students": "swabbies",
    "are": "be",
    "lawyer": "foul blaggard",
    "the": "th'",
    "restroom": "head",
    "my": "me",
    "hello": "avast",
    "is": "be",
    "man": "matey",
  }

  @classmethod
  def _translate(cls, word_list, dictionary):
    result = []
    for x in word_list:
      if x in dictionary:
        result.append(dictionary[x])
      else:
        result.append(x)
    return result

  @classmethod
  def translateBackwards(cls, s):
    reverse_dict = dict((y, x) for (x, y) in cls.ENGLISH_TO_PIRATE.items())
    result = cls._translate(s.split(), reverse_dict)
    return ' '.join(result)

  @classmethod
  def translateWordParts(cls, s):
    result = s
    for english, pirate in cls.ENGLISH_TO_PIRATE.items():
      result = result.replace(english, pirate)
    return result

  @classmethod
  def alwaysPrependSpace(cls, s):
    result = ''
    for w in s.split():
      if w in cls.ENGLISH_TO_PIRATE:
        result += ' ' + cls.ENGLISH_TO_PIRATE[w]
      else:
        result += ' ' + w
    return result

  @classmethod
  def alwaysAppendSpace(cls, s):
    result = ''
    for w in s.split():
      if w in cls.ENGLISH_TO_PIRATE:
        result += cls.ENGLISH_TO_PIRATE[w] + ' '
      else:
        result += w + ' '
    return result

  @classmethod
  def onlySpaceAfterPirateWords(cls, s):
    result = ''
    for w in s.split():
      if w in cls.ENGLISH_TO_PIRATE:
        result += cls.ENGLISH_TO_PIRATE[w] + ' '
      else:
        result += w
    return result

  @classmethod
  def onlySpaceAfterEnglishWords(cls, s):
    result = ''
    for w in s.split():
      if w in cls.ENGLISH_TO_PIRATE:
        result += cls.ENGLISH_TO_PIRATE[w]
      else:
        result += w + ' '
    return result

  @classmethod
  def translateASingleWord(cls, s):
    result = []
    word_list = s.split()
    translate = True
    for x in word_list:
      if x in cls.ENGLISH_TO_PIRATE and translate:
        result.append(cls.ENGLISH_TO_PIRATE[x])
        translate = False
      else:
        result.append(x)
    return ' '.join(result)

  @classmethod
  def outputingStringIndexes(cls, s):
    result = []
    for i in range(len(s.split())):
      result.append(str(i))
    return ' '.join(result)

  @classmethod
  def returnListInsteadOfString(cls, s):
    return cls._translate(s.split(), cls.ENGLISH_TO_PIRATE)

  @classmethod
  def returnInsideOfLoop(cls, s):
    for w in s.split():
      if w in cls.ENGLISH_TO_PIRATE:
        return cls.ENGLISH_TO_PIRATE[w]
      else:
        return w

  @classmethod
  def dontIndexDict(cls, s):
    result = []
    for x in s.split():
      if x in cls.ENGLISH_TO_PIRATE:
        result.append(str(cls.ENGLISH_TO_PIRATE))
      else:
        result.append(x)
    return ' '.join(result)

  @classmethod
  def joinWithoutSpace(cls, s):
    result = cls._translate(s.split(), cls.ENGLISH_TO_PIRATE)
    return ''.join(result)
`
  },
  tasks: [{
    id: 'translateToPirate',
    instructions: [{
      content: [
        'Given a mapping of English to Pirate words, write a program that ',
        'translates a string to Pirate. The input strings will contain only ',
        'lowercase letters, spaces and apostrophes.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Input: "excuse me madam where is the restroom"\n',
        'Output: "arr me proud beauty where be th\' head"'
      ].join(''),
      type: 'code'
    }],
    prerequisiteSkills: ['String Manipulation', 'Arrays', 'Dicts'],
    acquiredSkills: ['String Manipulation', 'Dicts'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'translateToPirate',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'sir',
        allowedOutputs: ['matey']
      }, {
        input: 'madam',
        allowedOutputs: ['proud beauty']
      }]
    }, {
      id: 'NO_OP',
      humanReadableName: 'no word to translate',
      testCases: [{
        input: '',
        allowedOutputs: ['']
      }, {
        input: 'be',
        allowedOutputs: ['be']
      }, {
        input: 'friend',
        allowedOutputs: ['friend']
      }]
    }, {
      id: 'MANY_TRANSLATABLE',
      humanReadableName: 'several words to translate',
      testCases: [{
        input: 'student in hotel',
        allowedOutputs: ['swabbie in fleabag inn']
      }, {
        input: 'excuse me madam where is the restroom',
        allowedOutputs: ["arr me proud beauty where be th' head"]
      }]
    }, {
      id: 'MATCHING_WORD_PARTS',
      humanReadableName: 'words that have prefixes with translations',
      testCases: [{
        input: 'many islands',
        allowedOutputs: ['many islands']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.translateBackwards',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Remember to translate from English to Pirate, not Pirate to English.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.translateASingleWord',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Remember to translate all the pirate words.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.translateWordParts',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Only look for complete words to translate. "human" should not be ',
          'translated to "humatey".'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.dontIndexDict',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Be sure to extract only the relevant value from the dictionary.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.joinWithoutSpace',
      ignoredTestSuiteIds: [],
      messages: [
        [
          "Don't forget spaces in your output."
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.alwaysPrependSpace',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Spaces should only appear between words, not at the ',
          'beginning of the sentence.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.alwaysAppendSpace',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Spaces should only appear between words, not at the ',
          'end of the sentence.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.onlySpaceAfterPirateWords',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'All words should be separated by spaces, regardless of ',
          'whether they are English words or Pirate words.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.onlySpaceAfterEnglishWords',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'All words should be separated by spaces, regardless of ',
          'whether they are English words or Pirate words.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.outputingStringIndexes',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'You need to output words, not the indexes of the words in the ',
          'string.'
        ].join(''),
        [
          'You need to output words, not word indexes. When you ',
          'call "range(len(list))" it returns numbers 0 through ',
          'N-1 (where N is the length of the list), not the items ',
          'in the list.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnListInsteadOfString',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Your function should return a string, not a list.'
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnInsideOfLoop',
      ignoredTestSuiteIds: [],
      messages: [
        [
          "It looks like you're only returning the first word in the input. ",
          "Be careful that your code does not exit too early."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
  }]
};
