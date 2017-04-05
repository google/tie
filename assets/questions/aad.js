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
 * @fileoverview Question data for Alien language alphabet.
 */

globalData.questions['aad'] = {  // eslint-disable-line dot-notation
  title: 'Alien language alphabet',
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
        'In this question, you\'ll implement the encode function. It takes a ',
        'string as input and returns an encoding of the string where long ',
        'runs of characters are replaced by <# characters>x<character>. For ',
        'example, "abcccccd" could be encoded as "ab5xc".'
      ].join('')
    ],
    prerequisiteSkills: ['Toplogy', 'Sorting', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'find_dict',
    correctnessTests: [{
      input: ["a",
              "ab",
              "b"],
      allowedOutputs: ['ab']
    }, {
      input: ["c",
              "a",
              "b",
              "a"],
      allowedOutputs: ['']
    }, {
      input: ["ab",
              "Aba",
              "b"],
      allowedOutputs: ['ab']
    }, {
      input: ["aaec",
              "aaed",
              "aac",
              "abe",
              "abc",
              "bed",
              "bea",
              "bcc",
              "bcd"],
      allowedOutputs: ['ecdab']
    }, {
      input: ["egdi",
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
              "idh"],
      allowedOutputs: ['afchjgdeib']
    },
    {
      input: ["curwfe",
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
              "kmrut"],
      allowedOutputs: ['ljhmezirxygadoqckfsvntwbup']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.wrongInNoSolution',
      messages: [
        [
          "What if there's no solution to the input ? ",
          "Just output \"\" when there's no solution. "
        ].join(''),
        [
          'You may try this case : ["c", "a", "b", "a"]',
        ].join('')
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.wrongInUppercase',
      messages: [
        [
          "What if there's Uppercase and lowercase but they're the same? ",
          "Just take them as the same letter."
        ].join(''),
        [
          'You may try this case : ["a", "Ab", "b"]',
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
