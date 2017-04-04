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
    buggyOutputTests: [],
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
