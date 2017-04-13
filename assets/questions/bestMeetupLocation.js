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

globalData.questions['bestMeetupLocation'] = {  // eslint-disable-line dot-notation
  title: 'Best Meeting Location for N People in a Manhattan-like City',
  starterCode: {
    python:
`def bestMeetupLocation(people):
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
    instructions: [
      [
        'N people live in a city with streets that form a regular 2D grid. ',
        'They start out at different intersections and want to meet up. ',
        'They are only able to move along the roads (no crossing blocks diagonally etc.). ',
        'Write a function bestMeetupLocation(people) that returns a meeting place that ',
        'minimizes the total travel distance.'
      ].join(''),
      [
        'The input is a list of strings indicating the coordinates of the people in a 2D grid. ',
        'Your function should return a string indicating the best meeting point for N people. ',
        'For instance, the best meeting point for 3 people at ',
        '"0, 0", "4, 2" and "2, 4" is "2, 2".'
      ].join('')
    ],
    prerequisiteSkills: ['Math', 'Sorting'],
    acquiredSkills: ['Math', 'Sorting'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'bestMeetupLocation',
    correctnessTests: [{
      input: ['0, 0', '4, 2', '10, 10'],
      allowedOutputs: ['4, 2']
    }, {
      input: ['0, 0', '5, 6', '4, 5', '20, 9'],
      allowedOutputs: ['4, 5', '4, 6', '5, 5', '5, 6']
    }, {
      input: [],
      allowedOutputs: ['']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.findAverageLocation',
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
    performanceTests: [{
      inputDataAtom: '0, 0',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'bestMeetupLocation'
    }]
  }, {
    instructions: [
      [
        'You might notice that some inputs have more than one possible "best" meeting point. ',
        'Modify your bestMeetupLocation function to return a list of all of the best meeting points.'
      ].join('')
    ],
    prerequisiteSkills: ['Math', 'Sorting'],
    acquiredSkills: ['Math', 'Sorting'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'bestMeetupLocation',
    correctnessTests: [{
      input: ['0, 0', '4, 2', '10, 10'],
      allowedOutputs: [['2, 2']]
    }, {
      input: ['0, 0', '5, 6', '4, 5', '20, 9'],
      allowedOutputs: [['4, 5', '4, 6', '5, 5', '5, 6']]
    }, {
      input: [],
      allowedOutputs: ['']
    }],
    buggyOutputTests: [],
    // TODO: the time complexity of the solution to this quesiton
    // is not linear. A performance test will be added later.
    performanceTests: []
  }],
  styleTests: [{
    evaluationFunctionName: 'allowOnlyOneFunction',
    expectedOutput: true,
    message: [
      'You should only be writing code in a bestMeetupLocation function. While ',
      "decomposition is generally a good idea, you shouldn't need more than ",
      'just this function for this question.'
    ].join('')
  }]
};

