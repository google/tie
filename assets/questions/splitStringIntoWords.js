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
 * @fileoverview Question data for Split String into Words.
 */

globalData.questions['splitStringIntoWords'] = {  // eslint-disable-line dot-notation
  title: 'Split String into Words',
  starterCode: {
    python:
`def splitStringIntoWords(string_and_set_list):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def returnOriginalString(cls, s):
        return s

    @classmethod
    def processLongStringToStringAndSet(cls, s):
      split_string = s.split(":")
      set_string = split_string[1].split(" ")
      set_object = set()
      for word in set_string:
        set_object.add(word)
      return [split_string[0], set_object]
`
  },
  tasks: [{
    id: 'splitIntoTwoWords',
    instructions: [{
      content: [
        'For this question, you\'ll implement the splitStringIntoWords ',
        'function. This function takes a list of two elements, the first ',
        'element being a string of letters with no whitespace and the ',
        'second element being a set of valid words. The function should ',
        'take the input string and split it ',
        'into two words that are both in the given ',
        'set. If there is no valid solution, return \'None\'.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Input: ["fruitsalad", ["friend", "fruit", "banana", "salad"]]',
        'Output: "fruit salad"'
      ].join('\n'),
      type: 'code'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'Sets', 'Lists'],
    acquiredSkills: ['String Parsing'],
    inputFunctionName: 'AuxiliaryCode.processLongStringToStringAndSet',
    outputFunctionName: null,
    mainFunctionName: 'splitStringIntoWords',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'goodneighbor:good neighbor',
        allowedOutputs: ['good neighbor']
      }, {
        input: 'hondacivic:honda civic accord',
        allowedOutputs: ['honda civic']
      }, {
        input: 'toyotacamry:honda civic accord',
        allowedOutputs: ['None']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.returnOriginalString',
      ignoredTestSuiteIds: [],
      messages: [
        [
          "Try running your code on 'newcode' on paper, assuming 'new' and ",
          "'code' are valid words. What's the result?"
        ].join(''),
        "Are you sure that you're separating 'new' and 'code' properly?",
        "It looks like you're returning the input without adding a space."
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'splitIntoWords',
    instructions: [{
      content: [
        'Next, expand your solution so that it can handle splitting the ',
        'string into more than just 2 valid words.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "freshfruitsalad"\nOutput: "fresh fruit salad"',
      type: 'code'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'Sets'],
    acquiredSkills: ['String Manipulation', 'Shortest Path Search'],
    inputFunctionName: 'AuxiliaryCode.processLongStringToStringAndSet',
    outputFunctionName: null,
    mainFunctionName: 'splitStringIntoWords',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'bluehondacivic:honda civic accord blue',
        allowedOutputs: ['blue honda civic']
      }, {
        input: 'verygoodneighbor:very neighbor good bad',
        allowedOutputs: ['very good neighbor']
      }, {
        input: 'graytoyotacamry:honda civic accord gray blue',
        allowedOutputs: ['None']
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    performanceTests: []
  }]
};
