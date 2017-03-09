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
 * @fileoverview Question data for Run-Length Encoding.
 */

globalData.questions['rle'] = {
  title: 'Run-Length Encoding',
  starterCode: {
    python:
`def encode(word):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def skipEncodingAtEndOfString(cls, word):
        pass

    @classmethod
    def ignoreStringLengthWhenEncoding(cls, word):
        pass


    @classmethod
    def failToDemarcateBeginningOfEncodedChunk(cls, word):
        pass


    @classmethod
    def DecodeEncodedString(cls, word):
        pass
`
  },
  prompts: [{
    instructions: [
      [
        'In this question, you\'ll implement the encode function. It takes a ',
        'string as input and returns an encoding of the string where long ',
        'runs of characters are replaced by <# characters>x<character>. For ',
        'example, "abcccccd" should be encoded as "ab5xc".'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'encode',
    correctnessTests: [{
      input: 'abcccccd',
      expectedOutput: 'ab5xcd'
    }, {
      input: 'ddddddddddef',
      expectedOutput: '10xdef'
    },
    {
      input: 'budddddddddd',
      expectedOutput: 'bu10xd'
    }],
    buggyOutputTests: [{
      buggyFunction: 'AuxiliaryCode.skipEncodingAtEndOfString',
      messages: [
        "Run your code on 'adddd' in your head. What's the result?",
        "It looks like the issue is with the last few characters of the string.",
        [
          "It doesn't seem like you're encoding a run if it occurs at the end ",
          "of an input string."
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Next, double-check your code to make sure it handles short strings. ',
        'Ideally, these strings should be as small as possible after encoding.',
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunction: null,
    outputFunction: null,
    mainFunction: 'encode',
    correctnessTests: [{
      input: 'bbb',
      expectedOutput: ['3xb', 'bbb']
    }, {
      input: 'aa',
      expectedOutput: 'aa'
    }, {
      input: 'a',
      expectedOutput: 'a'
    }, {
      input: '',
      expectedOutput: ''
    }],
    buggyOutputTests: [{
      buggyFunction: 'AuxiliaryCode.ignoreStringLengthWhenEncoding',
      messages: [
        [
          "Try running your encode method on 'aa' on paper. ",
          "Is your result what you expect?"
        ].join(''),
        [
          "It looks like you're encoding the string, which is fine, but does ",
          "this seem like an improvement?"
        ].join(''),
        [
          "For short strings, you're actually increasing the length of the ",
          "encoded string. You don't need to encode strings with length <= 3."
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      [
        'Next, make sure that your method\'s output can accurately be decoded. ',
        'For each <#x{c}> pair, the decode method will repeat the character c ',
        '# times.'
      ].join(''),
      [
        'This should allow us to decode your encoded string and get the same ',
        'result as the input.'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
    inputFunction: null,
    outputFunction: 'AuxiliaryCode.DecodeEncodedString',
    mainFunction: 'encode',
    correctnessTests: [{
      input: '5xb',
      expectedOutput: '5xb'
    }, {
      input: '2aaaaaab7',
      expectedOutput: '2aaaaaab7'
    }],
    buggyOutputTests: [{
      buggyFunction: 'AuxiliaryCode.failToDemarcateBeginningOfEncodedChunk',
      messages: [
        [
          "Try running your code on '5aaaa' in your head. ",
          "What will happen when you try to decode that string?"
        ].join(''),
        [
          'So your function takes in something like "2aaaaaab7" and returns ',
          "\"26xab7\". What will happen when that string is run through decode()?"
        ].join(''),
        [
          "Even though it'll make the encoded string longer, you might want ",
          "to separate out numbers if they come before a run, otherwise it'll ",
          "confuse the decoder."
        ].join('')
      ]
    }],
    performanceTests: [{
      inputDataAtom: 'o',
      transformationFunction: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunction: 'encode'
    }]
  }],
  styleTests: [{
    evaluationFunction: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in an encode function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};
