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

globalData.questions['aad'] = {  // eslint-disable-line dot-notation
  title: 'Alien Language Alphabet',
  starterCode: {
    python:
`def find_dict(words):
    return ""
`
  },
  auxiliaryCode: {
    python:
`
class AuxiliaryCode(object):
    @classmethod
    def wrongInNoSolution(cls, words):
      e = {}
      deg = {}
  
      for str in words:
          for ch in str:
              ch = ch.lower()
              if(not e.has_key(ch)):
                  e[ch] = []
                  deg[ch] = 0
  
      for i in range(len(words) - 1):
          for j in range(min(len(words[i]), len(words[i + 1]))):
              be = words[i][j].lower()
              to = words[i + 1][j].lower()
              if(be != to):
                  e[be].append(to)
                  deg[to] = deg[to] + 1
                  break
  
      ans = ""
  
      while True :
          flag = False
          for key in deg:
              if deg[key] == 0 :
                  flag = True
                  ans = ans + key;
                  for it in e[key]:
                      deg[it] = deg[it] - 1
                  del deg[key]
          if (not flag):
              break;
  
      return ans
      
    @classmethod
    def wrongInUppercase(cls, words):
      e = {}
      deg = {}
  
      for str in words:
          for ch in str:
              if(not e.has_key(ch)):
                  e[ch] = []
                  deg[ch] = 0
  
      for i in range(len(words) - 1):
          for j in range(min(len(words[i]), len(words[i + 1]))):
              be = words[i][j]
              to = words[i + 1][j]
              if(be != to):
                  e[be].append(to)
                  deg[to] = deg[to] + 1
                  break
  
      ans = ""
  
      while True :
          flag = False
          for key in deg:
              if deg[key] == 0 :
                  flag = True
                  ans = ans + key;
                  for it in e[key]:
                      deg[it] = deg[it] - 1
                  del deg[key]
          if (not flag):
              break;
      
      if(not (len(deg) == 0)) :
          return ""
  
      return ans
`
 
  },
  tasks: [{
    instructions: [
      [
        'Given a dictionary (a list of words in lexicographic order) of all',
        'words in an unknown/invented language, find the alphabet (an ordered ',
        'list of characters) of that language. '
      ].join(''),
      'Example dictionary:',
      '[art, rat, cat, car]',
      'Alphabet is: "atrc"'
    ],
    prerequisiteSkills: ['Topology Sorting', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'find_dict',
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
        'case that has multi-answers, return the answer has the smallest ',
        'lexicographic order in English alphabet.'
      ].join('')
    ],
    prerequisiteSkills: ['Topology Sorting', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'find_dict',
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
          'You may try this case : ["c", "a", "b", "a"]'
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Last, Let\'s fix the solution to adapt lowercase and uppercase. We ',
        'take the lowercase and uppercase of the same letter with equal ',
        'lexicographic order. And then return the answer in lowercase'
      ].join('')
    ],
    prerequisiteSkills: ['Topology Sorting', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'find_dict',
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
          'You may try this case : ["a", "Ab", "b"]'
        ].join(''),
        [
          'The answer to the test case ["a", "Ab", "b"] should be "ab".'
        ].join('')
      ]
    }],
    performanceTests: []
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in an encode function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
