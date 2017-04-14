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
 * @fileoverview Question data for String to Dict.
 */

globalData.questions['stringToDict'] = {  // eslint-disable-line dot-notation
  title: 'Split String to Words',
  starterCode: {
    python:
`def preProcess(s): // necessary because no functionality for taking multiple inputs
    // s is passed in as 'stringtoparse:words in dictionary' and converted two two parameters
    spl = s.split(":")
    dict_str = spl[1].split(" ")
    dict = set()
    for el in dict_str:
      dict.add(el)
    return stringToDict(spl[0], dict)

def stringToDict(s, dict):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def returnOriginalString(cls, s):
        return s
`
  },
  tasks: [{
    instructions: [
      [
        'For this question, you\'ll implement the stringToDict function. This ',
        'function takes a string of alphabetic letters with no whitespaces and a ',
        'dictionary represented as a set. The function should take the input string and ',
        'split it into two space-separated words that are both in the given dictionary. ',
        'If there is no valid solution, return \'No Solution\' .'
      ].join(''),
      "For instance, 'fruitsalad' becomes 'fruit salad', assuming fruit and salad are in the dictionary.",
      [
        'Note: You do not need to understand the preProcess function. Preprocess does some ',
        'preprocessing that allows two arguments to be passed into the stringToDict function which ',
        'you will implement. An input string is passed into preProcess that contains both the ',
        'string you are to parse and the given dictionary for stringToDict, separated by a colon.'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'Sets'],
    acquiredSkills: ['String Parsing'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'preProcess',
    correctnessTests: [{
      input: 'goodneighbor:good neighbor',
      allowedOutputs: ['good neighbor']
    }, {
      input: 'hondacivic:honda civic accord',
      allowedOutputs: ['honda civic']
    }, {
      input: 'toyotacamry:honda civic accord',
      allowedOutputs: ['No Solution']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.returnOriginalString',
      messages: [
        [
          "Try running your code on 'newcode' on paper, assuming 'new' and 'code' ",
          "are valid words. What's the result?"
        ].join(''),
        "Are you sure that you're separating 'new' and 'code' properly?",
        "It looks like you're returning the original string without adding a space."
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Next, expand your solution so that it can handle splitting the string ',
        'into more than just 2 valid words.'
      ].join(''),
      "For instance, 'freshfruitsalad' becomes 'fresh fruit salad'."
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'Sets'],
    acquiredSkills: ['String Manipulation', 'Shortest Path Search'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'preProcess',
    correctnessTests: [{
      input: 'bluehondacivic:honda civic accord blue',
      allowedOutputs: ['blue honda civic']
    }, {
      input: 'verygoodneighbor:very neighbor good bad',
      allowedOutputs: ['very good neighbor']
    }, {
      input: 'graytoyotacamry:honda civic accord gray blue',
      allowedOutputs: ['No Solution']
    }],
    buggyOutputTests: [],
    performanceTests: []
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in a words function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
