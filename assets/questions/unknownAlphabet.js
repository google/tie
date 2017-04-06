// Copyright 2017 The TIE Author, s. All Rights Reserved.
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
 * @fileoverview Question data for Alien language alphabet.
 */

globalData.questions['unknownAlphabet'] = {  // eslint-disable-line dot-notation
  title: 'Alien Language Alphabet',
  starterCode: {
    python:
`def findDictionary(words):
    return ""`
  },
  auxiliaryCode: {
    python:
`
class AuxiliaryCode(object):
  @classmethod
  def wrongInNoSolution(cls, words):
    #  e stores the edges that need to build for the alphabet graph
    #  e[ch] is a list of letters for letter ch whose ranks are bigger than
    #  ch's rank.
    #  degree stores the degree of each letter.
    #  For each letter ch, there're degree[ch] letters has an edge goes to ch
    edges = {}
    degree = {}
    for word in words:
      for ch in word:
        ch = ch.lower()
        if(not edges.has_key(ch)):
          edges[ch] = []
          degree[ch] = 0
    for wordIndex in range(len(words) - 1):
      for letterIndex in range(min(len(words[wordIndex]), len(words[wordIndex + 1]))):
        letterOne = words[wordIndex][letterIndex].lower()
        letterTwo = words[wordIndex + 1][letterIndex].lower()
        if(letterOne != letterTwo):
          edges[letterOne].append(letterTwo)
          degree[letterTwo] = degree[letterTwo] + 1
          break
    answer  = ""
    hasZeroDegreeLetter = True
    while hasZeroDegreeLetter :
      hasZeroDegreeLetter = False
      for key in degree:
        if (0 == degree[key]):
          hasZeroDegreeLetter = True
          answer = answer + key
          for nextLetter in edges[key]:
            degree[nextLetter] = degree[nextLetter] - 1
          del degree[key]
      if (not hasZeroDegreeLetter):
        break
    return answer
    
    
  @classmethod
  def wrongInUppercase(cls, words):
    edges = {}
    degree = {}
    for word in words:
      for ch in word:
        ch = ch
        if(not edges.has_key(ch)):
          edges[ch] = []
          degree[ch] = 0
    for wordIndex in range(len(words) - 1):
      for letterIndex in range(min(len(words[wordIndex]), len(words[wordIndex + 1]))):
        letterOne = words[wordIndex][letterIndex]
        letterTwo = words[wordIndex + 1][letterIndex]
        if(letterOne != letterTwo):
          edges[letterOne].append(letterTwo)
          degree[letterTwo] = degree[letterTwo] + 1
          break
    answer  = ""
    hasZeroDegreeLetter = True
    while hasZeroDegreeLetter :
      hasZeroDegreeLetter = False
      for key in degree:
        if (0 == degree[key]):
          hasZeroDegreeLetter = True
          answer = answer + key
          for nextLetter in edges[key]:
            degree[nextLetter] = degree[nextLetter] - 1
          del degree[key]
      if (not hasZeroDegreeLetter):
        break
    if (not (len(degree) == 0)):
      return ""
    return answer
`
 
  },
  tasks: [{
    instructions: [
      [
        'Given a dictionary (a list of words in lexicographic order) of all',
        'words in an unknown/invented language, write a function findDictonary ',
        'that returns the alphabet (an ordered list of characters) of that language. '
      ].join(''),
      'Example dictionary:',
      '[art, rat, cat, car]',
      'Alphabet is: "atrc"'
    ],
    prerequisiteSkills: ['Topological Sorting', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findDictionary',
    correctnessTests: [{
      input: [
        "a",
        "ab",
        "b"
      ],
      allowedOutputs: ['ab']
    }, {
      input: [
        "aaec",
        "aaed",
        "aac",
        "abe",
        "abc",
        "bed",
        "bea",
        "bcc",
        "bcd"
      ],
      allowedOutputs: ['ecdab']
    }, {
      input: [
        "egdi",
        "egdb",
        "egej",
        "egei",
        "ebjj",
        "ebjg",
        "ebgh",
        "ebgj",
        "igac",
        "igae",
        "igia",
        "igif",
        "idcf",
        "idcc",
        "idh"
      ],
      allowedOutputs: ['afchjgdeib']
    },
    {
      input: [
        "curwfe",
        "curwfe",
        "curwst",
        "curwsw",
        "curuyc",
        "curuyf",
        "curuga",
        "curugs",
        "cuxdeh",
        "cuxdeu",
        "cuxdbv",
        "cuxdbn",
        "cuxolc",
        "cuxolb",
        "cuxojd",
        "cuxojs",
        "cpcnow",
        "cpcnob",
        "cpcnqu",
        "cpcnqp",
        "cpctkj",
        "cpctkd",
        "cpctfg",
        "cpctfa",
        "cpbjeq",
        "cpbjec",
        "cpbjz",
        "cpbhx",
        "cpbhc",
        "khjzs",
        "khjzu",
        "khjis",
        "khjiv",
        "khfax",
        "khfay",
        "khftg",
        "khftq",
        "kmima",
        "kmimd",
        "kmiej",
        "kmies",
        "kmrbm",
        "kmrbr",
        "kmrus",
        "kmrut"
      ],
      allowedOutputs: ['ljhmezirxygadoqckfsvntwbup']
    }],
    buggyOutputTests: [],
    performanceTests: []
  }, {
    instructions: [
      [
        'Next, double-check your code to make sure it handles unexpected cases',
        ', such as there\'s no solution to the test case or there\'re more ',
        'than one answers.'
      ].join(''),
      [
        'For the test case that has no solution, just return "". For the test ',
        'case that has multiple answers, return the answer has the smallest ',
        'lexicographic order in English alphabet.'
      ].join(''),
      'Example dictionary:',
      '[a, b, a]',
      'Alphabet is: ""',
      '[cba]',
      'Alphabet is: "abc"'
    ],
    prerequisiteSkills: ['Topological Sorting', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findDictionary',
    correctnessTests: [{
      input: [
        "a",
        "b",
        "a"
      ],
      allowedOutputs: ['']
    }, {
      input: [
        "c",
        "a",
        "b",
        "a"
      ],
      allowedOutputs: ['']
    }, {
      input: [
        "cab",
        "bc"
      ],
      allowedOutputs: ['acb']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.wrongInNoSolution',
      messages: [
        [
          'What if the test case is ["c", "a", "b", "a"]?',
          'And what answer your code will generate for this test case?'
        ].join(''),
        [
          'The answer to that case should be a empty string. But what your code',
          ' have returned?'
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Finally, modify your code to handle strings with a mix of lowercase ',
        'and uppercase letters. Assume that a lowercase and uppercase version ',
        'of a letter is the same with regards to lexicographic ordering. Your ',
        'answer, though, should be lowercase.'
      ].join(''),
      'Example dictionary:',
      '[b, Ba]',
      'Alphabet is: "ab"'
    ],
    prerequisiteSkills: ['Topological Sorting', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findDictionary',
    correctnessTests: [{
      input: [
        "ab",
        "Aba",
        "b"
      ],
      allowedOutputs: ['ab']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.wrongInUppercase',
      messages: [
        [
          'Think about this test case in your head: ["a", "Ab", "b"]'
        ].join(''),
        [
          'The answer to the test case ["a", "Ab", "b"] should be "ab". Did ',
          'your code return the string with some letters in uppercase?'
        ].join('')
      ]
    }],
    performanceTests: []
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in an findDictionary function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
