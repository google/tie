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

globalData.questions['runLengthEncoding'] = {  // eslint-disable-line dot-notation
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
        if len(word) < 3:
            return word
        repeating = False
        num_repeats = 0
        start_repeating = 0
        result = ''
        for i in range(len(word)):
            if word[i].isdigit():
                result += '%sx%s' % (1, word[i])
                continue
            if i < (len(word) - 1) and word[i] == word[i + 1]:
                if not repeating:
                    repeating = True
                    num_repeats = 2
                    start_repeating = i
                else:
                    num_repeats += 1
            elif repeating and i < (len(word) - 1):
                repeating = False
                result += '%sx%s' % (num_repeats, word[start_repeating])
            else:
                result += word[i]
        return result

    @classmethod
    def ignoreStringLengthWhenEncoding(cls, word):
        repeating = False
        num_repeats = 0
        start_repeating = 0
        result = ''
        for i in range(len(word)):
            if word[i].isdigit():
                result += '%sx%s' % (1, word[i])
                continue
            if i < (len(word) - 1) and word[i] == word[i + 1]:
                if not repeating:
                    repeating = True
                    num_repeats = 2
                    start_repeating = i
                else:
                    num_repeats += 1
            elif repeating:
                repeating = False
                result += '%sx%s' % (num_repeats, word[start_repeating])
            else:
                result += word[i]
        if repeating:
            repeating = False
            result += '%sx%s' % (num_repeats, word[start_repeating])
        return result


    @classmethod
    def failToDemarcateBeginningOfEncodedChunk(cls, word):
        if len(word) < 3:
            return word
        repeating = False
        num_repeats = 0
        start_repeating = 0
        result = ''
        for i in range(len(word)):
            if i < (len(word) - 1) and word[i] == word[i + 1]:
                if not repeating:
                    repeating = True
                    num_repeats = 2
                    start_repeating = i
                else:
                    num_repeats += 1
            elif repeating:
                repeating = False
                result += '%sx%s' % (num_repeats, word[start_repeating])
            else:
                result += word[i]
        if repeating:
            repeating = False
            result += '%sx%s' % (num_repeats, word[start_repeating])
        return result


    @classmethod
    def decodeEncodedString(cls, encoded_string):
        number_block = False
        start_block = 0
        end_block = 0
        result = ''
        i = 0
        while i < len(encoded_string):
            if encoded_string[i].isdigit() and not number_block:
                number_block = True
                start_block = i
            elif not encoded_string[i].isdigit() and number_block:
                number_block = False
                end_block = i - 1
                num_string = encoded_string[start_block:(end_block + 1)]
                num = int(num_string)
                if encoded_string[i] == 'x' and i < len(encoded_string) - 1:
                    result += (encoded_string[i + 1] * num)
                    i += 1
            elif not number_block:
                result += encoded_string[i]
            i += 1
        return result
`
  },
  tasks: [{
    id: 'encodeStringNaively',
    instructions: [{
      content: [
        'In this question, you\'ll implement the encode function. It takes ',
        'a string as input and returns an encoding of the string where long ',
        'runs of characters are replaced by <# characters>x<character>.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: "abcccccd"\nOutput: "ab5xcd"',
      type: 'code'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'encode',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'abcccccd',
        allowedOutputs: ['ab5xcd']
      }, {
        input: 'ddddddddddef',
        allowedOutputs: ['10xdef']
      }, {
        input: 'budddddddddd',
        allowedOutputs: ['bu10xd']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.skipEncodingAtEndOfString',
      ignoredTestSuiteIds: [],
      messages: [
        "Run your code on 'adddd' in your head. What's the result?",
        [
          'It looks like the issue is with the last few characters of the ',
          'string.'
        ].join(''),
        [
          "It doesn't seem like you're encoding a run if it occurs at the end ",
          "of an input string."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'encodeStringOptimally',
    instructions: [{
      content: [
        'Next, double-check your code to make sure it handles short ',
        'strings. Ideally, these strings should be as small as possible ',
        'after encoding.'
      ].join(''),
      type: 'text'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'encode',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'bbb',
        allowedOutputs: ['3xb', 'bbb']
      }]
    }, {
      id: 'SHORT_STRINGS',
      humanReadableName: 'short strings',
      testCases: [{
        input: 'aa',
        allowedOutputs: ['aa']
      }, {
        input: 'a',
        allowedOutputs: ['a']
      }, {
        input: '',
        allowedOutputs: ['']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.ignoreStringLengthWhenEncoding',
      ignoredTestSuiteIds: [],
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
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'encodeStringDecodably',
    instructions: [{
      content: [
        'Next, make sure that your method\'s output can accurately be ',
        'decoded. For each <#x{c}> pair, the decode method will repeat the ',
        'character c # times. Note that the input strings may also contain ',
        'digits.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'We should be able to run "decode" on your encoded string and get ',
        'the original string back as a result.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'You may find that, in order to complete this task, you have to ',
        'relax or compromise on some of the original constraints. As ',
        'long as the input can be correctly encoded and then decoded, ',
        'this is fine.'
      ].join(''),
      type: 'text'
    }],
    prerequisiteSkills: ['Arrays', 'Strings', 'String Manipulation'],
    acquiredSkills: ['String Manipulation', 'Sets', 'Arrays', 'Maps'],
    inputFunctionName: null,
    outputFunctionName: 'AuxiliaryCode.decodeEncodedString',
    mainFunctionName: 'encode',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: '5xb',
        allowedOutputs: ['5xb']
      }, {
        input: '2aaaaaab7',
        allowedOutputs: ['2aaaaaab7']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.failToDemarcateBeginningOfEncodedChunk',
      ignoredTestSuiteIds: [],
      messages: [
        [
          "Try running your code on '5aaaa' in your head. ",
          "What will happen when you try to decode that string?"
        ].join(''),
        [
          'So your function takes in something like "2aaaaaab7" and returns ',
          '"26xab7". What will happen when that string is run through ',
          'decode()?'
        ].join(''),
        [
          "Even though it'll make the encoded string longer, you might want ",
          "to separate out numbers if they come before a run, otherwise it'll ",
          "confuse the decoder."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: 'o',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'encode'
    }]
  }]
};
