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
 * @fileoverview Question data for i18n.
 */

globalQuestionData['i18n'] = {
  title: 'Internationalization (i18n)',
  starterCode: {
    python:
`def abbreviate(word):
    return ""

def are_all_unique(words):
    return True
`
  },
  auxiliaryCode: {
    python:
`def forgetLastLetter(word):
    result = "%s%d" % (word[0], len(word) - 2) if len(word) > 2 else word
    return result

def useFirstAndLastLetterAndLengthToAbbreviate(word):
    if word:
        return "%s%d%s" % (word[0], len(word) - 2, word[len(word) - 1])
    return ""

def createListOfUniqueStrings(atom, size):
    result = []
    for i in range(size):
        result.append(atom * (i + 1))
    return result
`
  },
  prompts: [{
    instructions: [
      'Welcome to this programming exercise.',
      [
        'Your first task is to implement the abbreviate function. It takes a ',
        'string as input and returns an abbreviation of the string of the form ',
        '<first character><length of the middle of the string><last character>. ',
        'For example, "internationalization" should be abbreviated as "i18n".'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'abbreviate',
    correctnessTests: [{
      input: 'internationalization',
      expectedOutput: 'i18n'
    }, {
      input: 'monkey',
      expectedOutput: 'm4y'
    }, {
      input: 'friendship',
      expectedOutput: 'f8p'
    }],
    buggyOutputTests: [{
      buggyFunction: 'forgetLastLetter',
      messages: [
        "It looks like your output (%s) doesn't match our expected output (%s).",
        [
          "You seem to be dropping the last character of the string when ",
          "you\'re abbreviating."
        ].join(''),
        [
          "Make sure to add the last character of the string back on when ",
          "you\'ve abbreviated."
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        "It's always important to think about the edge cases for your code. ",
        'In this case, short strings are not abbreviated by this strategy. ',
        "Make sure your code doesn't try to abbreviate when it's not necessary."
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'abbreviate',
    correctnessTests: [{
      input: 'cat',
      expectedOutput: 'cat'
    }, {
      input: 'at',
      expectedOutput: 'at'
    }, {
      input: 'a',
      expectedOutput: 'a'
    }, {
      input: '',
      expectedOutput: ''
    }],
    buggyOutputTests: [{
      buggyFunction: 'useFirstAndLastLetterAndLengthToAbbreviate',
      messages: [
        "It looks like your output (%s) doesn't match our expected output (%s).",
        [
          "It looks like you're using the string's length minus two in the ",
          "middle, which is usually fine, but can you think of any issues ",
          "that might present?"
        ].join(''),
        [
          "For short strings, you're actually ending up with a negative ",
          "number in the middle. You don't need to abbreviate strings with ",
          "length <= 3."
        ].join('')
      ]
    }],
    performanceTests: [{
      inputDataAtom: 'm',
      transformationFunction: 'extendString',
      expectedPerformance: 'constant',
      evaluationFunction: 'abbreviate'
    }]
  }, {
    instructions: [
      [
        "Implement are_all_unique, a function that takes a list of strings as ",
        "input and returns a boolean indicating whether all the strings in ",
        "the input are unique when abbreviated by the above abbreviate ",
        "function."
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'are_all_unique',
    correctnessTests: [{
      input: ['cat', 'dog', 'cart'],
      expectedOutput: true
    }, {
      input: ['clot', 'dog', 'cart'],
      expectedOutput: false
    }],
    buggyOutputTests: [],
    performanceTests: [{
      inputDataAtom: 'o',
      transformationFunction: 'createListOfUniqueStrings',
      expectedPerformance: 'linear',
      evaluationFunction: 'are_all_unique'
    }]
  }],
  styleTests: [{
    evaluationFunction: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      "You should only be writing code in an abbreviate function. While ",
      "decomposition is generally a good idea, you shouldn't need more than ",
      "just this function for this exercise."
    ].join('')
  }]
};
