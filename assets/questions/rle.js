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

globalQuestionData['rle'] = {
  title: 'Run-Length Encoding',
  starterCode: {
    python:
`def encode(word):
    return ""
`
  },
  auxiliaryCode: {
    python:
`def skipEncodingAtEndOfString(word):
    pass

def ignoreStringLengthWhenEncoding(word):
    pass

def failToDemarcateBeginningOfEncodedChunk(word):
    pass

def DecodeEncodedString(word):
    pass
`
  },
  prompts: [{
    instructions: [
      [
        'Implement the encode function. It takes a string as input and ',
        'returns an encoding of the string where long runs of characters are ',
        'replaced by <# characters>x<character>. For example, "abcccccd" ',
        'should be encoded as "ab5xc".'
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
      buggyFunction: 'skipEncodingAtEndOfString',
      messages: [
        "It looks like your output (%s) doesn't match our expected output (%s).",
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
      'You need to make sure that your code handles short strings correctly.'
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
      buggyFunction: 'ignoreStringLengthWhenEncoding',
      messages: [
        "It looks like your output (%s) doesn't match our expected output (%s).",
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
        'Good work! But we need to make sure that the string can accurately ',
        'be decoded. Think about whether the output of your function will ',
        'correctly be decoded back to the original string.'
      ].join(''),
      [
        'This should allow us to decode your encoded string and get the same ',
        'result as the input.'
      ].join('')
    ],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
    inputFunction: null,
    outputFunction: 'DecodeEncodedString',
    mainFunction: 'encode',
    correctnessTests: [{
      input: '5xb',
      expectedOutput: '5xb'
    }, {
      input: '2aaaaaab7',
      expectedOutput: '2aaaaaab7'
    }],
    buggyOutputTests: [{
      buggyFunction: 'failToDemarcateBeginningOfEncodedChunk',
      messages: [
        "It looks like your output (%s) doesn't match our expected output (%s).",
        [
          'So your function takes in something like "2aaaaaab7" and returns ',
          "\"26xab7\". Does that seem like it'll decode properly?"
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
      transformationFunction: 'extendString',
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
      'just this function for this exercise.'
    ].join('')
  }]
};
