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
 * @fileoverview Question data for Most Common Repeated Character.
 */

globalData.questions['findMostCommonRepeatedCharacter'] = {  // eslint-disable-line dot-notation
  title: 'Most Common Repeated Character',
  starterCode: {
    python:
`def findMostCommonRepeatedCharacter(s):
    return ""
`
  },
  auxiliaryCode: {
    python:
`import collections

class AuxiliaryCode(object):

    @classmethod
    def repeatsOnly(cls, s, ignore_case=True, reset_prev=True):
      output = []
      prev = None
      for c in s:
        if (prev and ignore_case and c.lower() == prev.lower()) or c == prev:
          output.append(prev)
          output.append(c)
          if reset_prev:
            prev = None
        else:
          prev = c
      return ''.join(output)
          
    @classmethod
    def overcountMoreThanTwoRepeats(cls, s):
      repeats = cls.repeatsOnly(s, True, False)
      if repeats:
        return collections.Counter(repeats).most_common(1)[0][0]
          
    @classmethod
    def dontIgnorePunctuation(cls, s):
      repeats = cls.repeatsOnly(s)
      repeats = [x for x in repeats if (not x.isalpha() and not x.isdigit())]
      if repeats:
        return collections.Counter(repeats).most_common(1)[0][0]
    
    @classmethod
    def dontIgnoreCase(cls, s):
      repeats = cls.repeatsOnly(s, False)
      if repeats:
        return collections.Counter(repeats).most_common(1)[0][0]
    
    @classmethod
    def lastRepeatOnly(cls, s):
      repeats = [x.lower() for x in cls.repeatsOnly(s)]
      if repeats:
        return repeats[-1].lower()
    
    @classmethod
    def firstRepeatOnly(cls, s):
      repeats = [x.lower() for x in cls.repeatsOnly(s)]
      if repeats:
        return repeats[0].lower()
    
    @classmethod
    def includeNonRepeated(cls, s):
      counter = collections.Counter(s)
      most_common = counter.most_common(1)
      if most_common:
        return most_common[0][0]
`
  },
  tasks: [{
    id: 'findMostCommonRepeatedCharacter',
    instructions: [{
      content: [
        'In this problem, we\'d like you to write a function that determines ',
        'the most common repeated character in an ASCII string (ignoring ',
        'spaces and punctuation). ',
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Note that uppercase and lowercase letters should be treated as the ',
        'same letter. ',
      ].join(''),
      type: 'text'
    }, {
      content: [
        'You may assume that the input string contains only one most common ',
        "repeated character (no input like 'aabb') but it could be that ",
        'there are no repeated characters in which case you should return ',
        'the empty string.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "Aardvarks always use cookbooks"\nOutput: "o"',
      type: 'code'
    }],
    prerequisiteSkills: ['String Manipulation', 'Arrays', 'Dicts'],
    acquiredSkills: ['String Manipulation', 'Dicts'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findMostCommonRepeatedCharacter',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'abbc',
        allowedOutputs: ['b']
      }, {
        input: 'aabc',
        allowedOutputs: ['a']
      }, {
        input: 'abcc',
        allowedOutputs: ['c']
      }]
    }, {
      id: 'NO_REPEAT',
      humanReadableName: 'no repeat',
      testCases: [{
        input: 'x',
        allowedOutputs: ['']
      }, {
        input: '',
        allowedOutputs: ['']
      }, {
        input: 'abc',
        allowedOutputs: ['']
      }]
    }, {
      id: 'MANY_REPEATS',
      humanReadableName: 'strings with several repeated letters',
      testCases: [{
        input: 'aardvarks use cookbooks with feelings',
        allowedOutputs: ['o']
      }, {
        input: 'aabbcbbdd',
        allowedOutputs: ['b']
      }]
    }, {
      id: 'MIXED_CASE',
      humanReadableName: 'mixed-case strings',
      testCases: [{
        input: 'AabbAa',
        allowedOutputs: ['a']
      }, {
        input: 'Aa',
        allowedOutputs: ['a']
      }]
    }, {
      id: 'NUMBERS',
      humanReadableName: 'strings with numbers',
      testCases: [{
        input: 'Add: 22+22=44',
        allowedOutputs: ['2']
      }]
    }, {
      id: 'SPECIAL_CHARACTERS',
      humanReadableName: 'strings with special characters',
      testCases: [{
        input: 'woot!!!!',
        allowedOutputs: ['o']
      }]
    }, {
      id: 'MANY_SPACES',
      humanReadableName: 'strings with more double spaces than letters',
      testCases: [{
        input: 'aa  a  a  a',
        allowedOutputs: ['a']
      }]
    }, {
      id: 'MOST_COMMON_IS_NOT_REPEATED',
      humanReadableName:
          'strings where the most common letter is not duplicated',
      testCases: [{
        input: 'abaccada',
        allowedOutputs: ['c']
      }]
    }, {
      id: 'REPEATS_GREATER_THAN_TWO',
      humanReadableName: 'strings with characters repeated more twice',
      testCases: [{
        input: 'bbaaaaabbcbb',
        allowedOutputs: ['b']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.includeNonRepeated',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Remember that we only care about repeated letters (like the ',
          "'t' in letter)"
        ].join(''),
        [
          "With an input like 'abaccada', you need to return 'c'"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.firstRepeatOnly',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Remember that you need to find the most common repeated letter ',
          'not just the first one'
        ].join(''),
        [
          "With an input like 'Aardvarks use cookbooks with feelings', you ",
          "need to return 'o'"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.lastRepeatOnly',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Remember that you need to find the most common repeated letter ',
          'not just the last one'
        ].join(''),
        [
          "With an input like 'Aardvarks use cookbooks with feelings', you ",
          "need to return 'o'"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.dontIgnoreCase',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Remember that you need to treat lowercase and uppercase letters ',
          'as equal'
        ].join(''),
        [
          "With an input like 'Aabbaa', you need to return 'a'"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.dontIgnorePunctuation',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Remember that we only count duplicate letters and numbers'
        ].join(''),
        [
          "With an input like 'woot!!!!', you need to return 'o'"
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.overcountMoreThanTwoRepeats',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'What happens when there are 3 or more repeated characters ',
          'in a row?'
        ].join(''),
        [
          "With an input like 'bbaaaaabbcbb', you need to return 'b'"
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: 'abbac',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'findMostCommonRepeatedCharacter'
    }]
  }]
};
