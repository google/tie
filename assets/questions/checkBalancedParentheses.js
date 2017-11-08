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
 * @fileoverview Question data for Balanced Parentheses.
 */

globalData.questions['checkBalancedParentheses'] = {  // eslint-disable-line dot-notation
  title: 'Balanced Parentheses',
  starterCode: {
    python:
`def isBalanced(s):
    return False
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def createBalancedParenthesesString(cls, atom, input_size):
        return "%s%s" % (atom[0] * input_size, atom[1] * input_size)

    @classmethod
    def countNumberOfParentheses(cls, s):
        numleft = 0
        numright = 0
        for char in s:
            if char == '(':
                numleft += 1
            elif char == ')':
                numright += 1
        return numleft == numright
`
  },
  tasks: [{
    id: 'verifyParens',
    instructions: [{
      content: [
        'For this question, you will implement the isBalanced function. ',
        'It takes a string of only parentheses as input and returns True if ',
        'for every open parentheses there is a matching closing ',
        'parentheses, and False otherwise.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "(())"\nOutput: True',
      type: 'code'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'isBalanced',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: '((()))',
        allowedOutputs: [true]
      }, {
        input: '()()()()()()(()',
        allowedOutputs: [false]
      }, {
        input: '))))))((((((',
        allowedOutputs: [false]
      }, {
        input: '()()()()()()()())(',
        allowedOutputs: [false]
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.countNumberOfParentheses',
      ignoredTestSuiteIds: [],
      messages: [
        "Try running your code on '))((' on paper. Did you expect that result?",
        [
          'Are you making sure the parentheses are properly balanced? () ',
          'is balanced, but )( is not.'
        ].join(''),
        [
          "It looks like you're counting the number of parentheses, and if ",
          "you have the same number of each kind, returning true. That's not ",
          "quite correct. See if you can figure out why."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'handleCornerCases',
    instructions: [{
      content: [
        'Now, double-check your code to make sure it handles unexpected ',
        'cases, such as the empty string. Once you think that it does, ',
        'submit it to check if you\'re correct.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        "We will guarantee that you will always be passed a string, so ",
        "don't worry about that."
      ].join(''),
      type: 'text'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'isBalanced',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'EMPTY_STRINGS',
      humanReadableName: 'empty strings',
      testCases: [{
        input: '',
        allowedOutputs: [true]
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'handleDifferentBraceTypes',
    instructions: [{
      content: [
        'Next, modify your code to support all types of braces ',
        '([], (), {}) and check that they are balanced against each other.'
      ].join(''),
      type: 'text'
    }, {
      content: '[(){}] is balanced, but ([)] is not.',
      type: 'code'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'isBalanced',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: '[(){}]',
        allowedOutputs: [true]
      }, {
        input: '(){}[]',
        allowedOutputs: [true]
      }, {
        input: '{{[[(())]]}}',
        allowedOutputs: [true]
      }, {
        input: '{}[{([{([{()}])}])}][]',
        allowedOutputs: [true]
      }, {
        input: ']{()}[',
        allowedOutputs: [false]
      }, {
        input: '[[[[[{{{{{((((([[[[[{{{{{((((()))))}}}}}]]]]])))))}}}}}]]]]}',
        allowedOutputs: [false]
      }]
    }, {
      id: 'DIFFERENT_TYPES',
      humanReadableName: 'balancing between different types',
      testCases: [{
        input: '([)]',
        allowedOutputs: [false]
      }, {
        input: '{{[[([})]]}}',
        allowedOutputs: [false]
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: '()',
      transformationFunctionName: (
        'AuxiliaryCode.createBalancedParenthesesString'),
      expectedPerformance: 'linear',
      evaluationFunctionName: 'isBalanced'
    }]
  }]
};
