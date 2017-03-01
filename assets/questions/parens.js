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

globalData.questions['parens'] = {
  title: 'Balanced Parentheses',
  starterCode: {
    python:
`def isBalanced(s):
    return False
`
  },
  auxiliaryCode: {
    python:
`def createBalancedParenthesesString(atom, input_size):
    return "%s%s" % (atom[0] * input_size, atom[1] * input_size)

def countNumberOfParentheses(s):
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
  prompts: [{
    instructions: [
      [
        'Implement the isBalanced function. It takes a string of parentheses ',
        'as input and returns True if for every open parentheses there is a ',
        'matching closing parentheses, and False otherwise. For example, (()) ',
        'is balanced.'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'isBalanced',
    correctnessTests: [{
      input: '((()))',
      expectedOutput: true
    }, {
      input: '()()()()()()(()',
      expectedOutput: false
    }, {
      input: '))))))((((((',
      expectedOutput: false
    }, {
      input: '()()()()()()()())(',
      expectedOutput: false
    }],
    buggyOutputTests: [{
      buggyFunction: 'countNumberOfParentheses',
      messages: [
        "It looks like you're returning True when you shouldn't.",
        [
          'Are you making sure the parentheses are properly balanced? () ',
          'is balanced, but )( is not.'
        ].join(''),
        [
          "It looks like you're counting the number of parentheses, and if ",
          "they're equal, returning true. That's not quite correct."
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Now, make sure your code handles unexpected cases, such as the ',
        'empty string.'
      ].join(''),
      [
        "We will guarantee that you will always be passed a string, so ",
        "don't worry about that."
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'isBalanced',
    correctnessTests: [{
      input: '',
      expectedOutput: true
    }, {
      input: 'xx',
      expectedOutput: false
    }, {
      input: '3',
      expectedOutput: false
    }],
    buggyOutputTests: [],
    performanceTests: []
  }, {
    instructions: [
      "Let's make this more challenging.",
      [
        'Now, you can have any types of braces, but they must be balanced ',
        'against each other.'
      ].join(''),
      'For instance, [(){}] is balanced, but ([)] is not.'
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'isBalanced',
    correctnessTests: [{
      input: '[(){}]',
      expectedOutput: true
    }, {
      input: '(){}[]',
      expectedOutput: true
    }, {
      input: '{{[[(())]]}}',
      expectedOutput: true
    }, {
      input: '{}[{([{([{()}])}])}][]',
      expectedOutput: true
    }, {
      input: '([)]',
      expectedOutput: false
    }, {
      input: '{{[[([})]]}}',
      expectedOutput: false
    }, {
      input: ']{()}[',
      expectedOutput: false
    }, {
      input: '[[[[[{{{{{((((([[[[[{{{{{((((()))))}}}}}]]]]])))))}}}}}]]]]}',
      expectedOutput: false
    }],
    buggyOutputTests: [],
    performanceTests: [{
      inputDataAtom: '()',
      transformationFunction: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunction: 'isBalanced'
    }]
  }],
  styleTests: [{
    evaluationFunction: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      "You should only be writing code in an isBalanced function. While ",
      "decomposition is generally a good idea, you shouldn't need more than ",
      "just this function for this exercise."
    ].join('')
  }]
};
