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
 * @fileoverview Question data for Bomberman.
 */

globalData.questions['bomberman'] = {  // eslint-disable-line dot-notation
  title: 'Bomberman',
  starterCode: {
    python:
`def bomb(board):
    return 0
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):

    @classmethod
    def ignoreWalls(cls, board):
        if not board or not board[0]:
            return 0
        rows = len(board)
        cols = len(board[0])
        maxEnemiesKilled = 0
        enemiesOnTop = [0 for x in range(cols)]
        enemiesOnLeft = 0
        enemiesKilled = [[0 for x in range(cols)] for y in range(rows)]
        for r in range(rows):
            enemiesOnLeft = 0
            for c in range(cols):
                if board[r][c] == "e":
                    enemiesOnLeft += 1
                    enemiesOnTop[c] += 1
                else:
                    enemiesKilled[r][c] += enemiesOnLeft + enemiesOnTop[c]
        enemiesOnRight = 0
        enemiesOnBottom = [0 for x in range(cols)]
        for r in range(rows - 1, -1, -1):
            enemiesOnRight = 0
            for c in range(cols - 1, -1, -1):
                if board[r][c] == "e":
                    enemiesOnRight += 1
                    enemiesOnBottom[c] += 1
                else:
                    enemiesKilled[r][c] += enemiesOnRight + enemiesOnBottom[c]
                    if enemiesKilled[r][c] > maxEnemiesKilled:
                        maxEnemiesKilled = enemiesKilled[r][c]
        return maxEnemiesKilled

    @classmethod
    def bombAllEnemiesOnBoard(cls, board):
        if not board or not board[0]:
            return 0
        count = 0
        for r in range(len(board)):
            for c in range(len(board[0])):
                if board[r][c] == "e":
                    count += 1
        return count
`
  },
  tasks: [{
    instructions: [
      {
        content: [
          'For this question, you will be given a board, in which all ',
          'elements are strings. "x" represents a wall, "e" represents ',
          'an enemy, and "" represents an empty cell. You can place ',
          'an bomb in an empty cell, which will kill all enemies in ',
          'vertical and horizontal directions until the blast hits a ',
          'wall or the edge of the board. Write a function bomb(board), ',
          'to find the best position to place a bomb in order to ',
          'kill as many enemies as possible, then return the number ',
          'of enemies killed.'
        ].join(''),
        type: 'text'
      }
    ],
    prerequisiteSkills: ['Arrays', 'Strings'],
    acquiredSkills: ['Dynamic Programming'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'bomb',
    correctnessTests: [{
      input: [],
      allowedOutputs: [0]
    }, {
      input: [[], [], []],
      allowedOutputs: [0]
    }, {
      input: [["e", "", "e", "x", "", "e"]],
      allowedOutputs: [2]
    }, {
      input: [["e", "", "e", "", "", "e"]],
      allowedOutputs: [3]
    }, {
      input: [["e"], ["x"], [""], ["x"]],
      allowedOutputs: [0]
    }, {
      input: [["e"], ["e"], [""], ["x"]],
      allowedOutputs: [2]
    }, {
      input: [["", "e", ""], ["e", "", "e"], ["", "e", ""]],
      allowedOutputs: [4]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.ignoreWalls',
      messages: [
        [
          "Try to run your code on [['e', '', 'x', 'e']]. ",
          "What's the result?"
        ].join(''),
        [
          "You seem to be ignoring walls in your solution, which is ",
          "incorrect. If a bomb is placed, the resulting explosion ",
          "could only go until it reaches a wall."
        ].join('')
      ]
    },
    {
      buggyFunctionName: 'AuxiliaryCode.bombAllEnemiesOnBoard',
      messages: [
        [
          "Try to run your code on [['e', 'x', '', 'x', 'e']]. ",
          "What's the result?"
        ].join(''),
        [
          "You seem to be returning all the enemies on the board. ",
          "Your bomb can only kill enemies in the same row and column. ",
          "And the explosion should stop once it hits a wall."
        ].join('')
      ]
    }],
    // The system currently only supports O(n) runtime complexities and
    // this requires an O(n^2) solution, so performance tests will be
    // implemented at a later date.
    performanceTests: []
  }],
  styleTests: []
};
