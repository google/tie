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
 * @fileoverview Question data for Best Meeting Location for N People in
 * a Manhattan-like City.
 */

globalData.questions['findBestMeetupLocation'] = {  // eslint-disable-line dot-notation
  title: 'Best Meeting Location for N People in a Manhattan-like City',
  starterCode: {
    python:
`def findBestMeetupLocation(people):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def findAverageLocation(cls, people):
        numPeople = len(people)
        if numPeople == 0:
            return ""
        x = 0
        y = 0
        for p in people:
            [dx, dy] = p.split(", ")
            x += int(dx)
            y += int(dy)
        x /= numPeople
        y /= numPeople
        return str(x) + ", " + str(y)
`
  },
  tasks: [{
    id: 'findBestMeetupLocation',
    instructions: [{
      content: [
        'N people live in a city with streets that form a regular 2D grid. ',
        'They start out at different intersections and want to meet up. ',
        'They are only able to move orthogonally along the roads (no ',
        'diagonal crossing). Write a function findBestMeetupLocation that ',
        'returns a meeting place minimizing the total travel distance.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'The input is a list of strings indicating the coordinates of the ',
        'people in a 2D grid. Your function should return a string ',
        'indicating the best meeting point for N people.'
      ].join(''),
      type: 'text'
    }, {
      content: 'Input: ["0, 0", "4, 2", "2, 4"]\nOutput: "2, 2"',
      type: 'code'
    }],
    prerequisiteSkills: ['Math', 'Sorting'],
    acquiredSkills: ['Math', 'Sorting'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findBestMeetupLocation',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: ['0, 0', '4, 2', '10, 10'],
        allowedOutputs: ['4, 2']
      }, {
        input: ['0, 0', '5, 6', '4, 5', '20, 9'],
        allowedOutputs: ['4, 5', '4, 6', '5, 5', '5, 6']
      }]
    }, {
      id: 'EMPTY_INPUT',
      humanReadableName: 'empty input',
      testCases: [{
        input: [],
        allowedOutputs: ['']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.findAverageLocation',
      ignoredTestSuiteIds: [],
      messages: [
        [
          "Try running your code on ['0, 0', '4, 2', '10, 10']. ",
          "Is the result what you expected?"
        ].join(''),
        [
          "The best meeting point is not necessarily",
          "the geometric center of all the points."
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: '0, 0',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'findBestMeetupLocation'
    }]
  }, {
    id: 'findAllBestMeetingPoints',
    instructions: [{
      content: [
        'You might notice that some inputs have more than one possible ',
        '"best" meeting point. Modify your bestMeetupLocation function to ',
        'return a list of all of the best meeting points.'
      ].join(''),
      type: 'text'
    }],
    prerequisiteSkills: ['Math', 'Sorting'],
    acquiredSkills: ['Math', 'Sorting'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'findBestMeetupLocation',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: ['0, 0', '4, 2', '10, 10'],
        allowedOutputs: [['2, 2']]
      }, {
        input: ['0, 0', '5, 6', '4, 5', '20, 9'],
        allowedOutputs: [['4, 5', '4, 6', '5, 5', '5, 6']]
      }]
    }, {
      id: 'EMPTY_INPUT',
      humanReadableName: 'empty input',
      testCases: [{
        input: [],
        allowedOutputs: ['']
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    // TODO: the time complexity of the solution to this quesiton
    // is not linear. A performance test will be added later.
    performanceTests: []
  }]
};

