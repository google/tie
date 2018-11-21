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
 * @fileoverview Question data for Sort Scrambled Itinerary.
 */

globalData.questions['sortItinerary'] = {  // eslint-disable-line dot-notation
  title: 'Sort Scrambled Itinerary',
  starterCode: {
    python:
`def sortItinerary(tickets):
    return ""
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
    @classmethod
    def connectTicketsInGivenOrder(cls, s):
        return "-".join(s.split(","))

    @classmethod
    def createLongLinearItinerary(cls, atom, input_size):
        if input_size <= 1:
          return "0-1"

        locations = [str(i) for i in xrange(input_size)]
        tickets = []
        for i in xrange(0, input_size-1):
          ticket = "-".join(locations[i:i+2])
          tickets.append(ticket)

        linear_combined_tickets = ",".join(tickets)
        return linear_combined_tickets
`
  },
  tasks: [{
    id: 'sortItinerary',
    instructions: [{
      content: [
        "For this problem, you'll implement a sortItinerary method, which ",
        'sorts a series of scrambled airline tickets into an itinerary. ',
        'This function takes as input a string representing an unordered ',
        'series of one-way plane tickets, represented by comma-separated ',
        'pairs of cities. Each pair is encoded as city of origin, dash, ',
        'destination city.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Input: "JFK-ATL,LAX-JFK"',
        'Output: "LAX-JFK,JFK-ATL"'
      ].join('\n'),
      type: 'code'
    }, {
      content: [
        'All tickets must be used to form an itinerary. ',
        'For now, you may assume both that there are no loops in the ',
        'itinerary, and that there is only one correct answer for a ',
        'given set of tickets.'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'If there is no solution, return None.'
      ].join(''),
      type: 'text'
    }],
    prerequisiteSkills: ['Graph', 'String Manipulation'],
    acquiredSkills: ['Graph Traversal', 'Topological Sorting'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'sortItinerary',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'ONE_TICKET_CASE',
      humanReadableName: 'one ticket case',
      testCases: [{
        input: 'LAX-JFK',
        allowedOutputs: ['LAX-JFK']
      }]
    }, {
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'JFK-ATL,LAX-JFK',
        allowedOutputs: ['LAX-JFK,JFK-ATL']
      }, {
        input: 'MUC-LHR,JFK-MUC,SFO-SJC,LHR-SFO',
        allowedOutputs: ['JFK-MUC,MUC-LHR,LHR-SFO,SFO-SJC']
      }]
    }, {
      id: 'INVALID_CASE',
      humanReadableName: 'the invalid case',
      testCases: [{
        input: 'JFK-ATL,LAX-SEA',
        allowedOutputs: [null]
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.connectTicketsInGivenOrder',
      ignoredTestSuiteIds: [],
      messages: [
        [
          'Try running your input on JFK-LAX,SEA-JFK,LAX-HOU. ',
          'Is the result what you expected?'
        ].join(''),
        [
          'Are you unscrambling the tickets in the itinerary, ',
          'or are you just connecting them in the given order?'
        ].join(''),
        [
          'It looks like you are not unscrambling the tickets. ',
          'Try treating the problem like a graph, where each ticket ',
          'is a directed edge between two nodes. Can you make a single ',
          'pass through the graph to find the right answer?'
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
    // The intended performance test below is commented out until we
    // support nonlinear runtime complexities.
    //
    // performanceTests: [{
    //  inputDataAtom: '',
    //  transformationFunctionName: 'AuxiliaryCode.createLongLinearItinerary',
    //  expectedPerformance: 'quadratic',
    //  evaluationFunctionName: 'sortItinerary'
    // }]
  }, {
    id: 'handleLoops',
    instructions: [{
      content: [
        'Now, modify your code to support loops. For instance, the ',
        'following itinerary should work: '
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Input: "SEA-SJC,SEA-SFO,PIT-SEA,SFO-PIT,HOU-SEA"',
        'Output: "HOU-SEA,SEA-SFO,SFO-PIT,PIT-SEA,SEA-SJC"'
      ].join('\n'),
      type: 'code'
    }],
    prerequisiteSkills: ['Graph', 'String Manupulation'],
    acquiredSkills: ['Dynamic Programming', 'Backtracking'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'sortItinerary',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'JFK-KUL,JFK-NRT,NRT-JFK',
        allowedOutputs: ['JFK-NRT,NRT-JFK,JFK-KUL']
      }]
    }, {
      id: 'HARD_CASE',
      humanReadableName: 'the hard case',
      testCases: [{
        input: 'JFK-SFO,JFK-ATL,SFO-ATL,ATL-JFK,ATL-SFO',
        allowedOutputs: ['JFK-ATL,ATL-JFK,JFK-SFO,SFO-ATl,ATL-SFO']
      }, {
        input: 'SEA-SJC,SEA-SFO,PIT-SEA,SFO-PIT,HOU-SEA',
        allowedOutputs: ['HOU-SEA,SEA-SFO,SFO-PIT,PIT-SEA,SEA-SJC']
      }, {
        input: 'AXA-TIA,JFK-ANU,ANU-TIA,TIA-AXA',
        allowedOutputs: ['JFK-ANU,ANU-TIA,TIA-AXA,AXA-TIA']
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'pickLexicographicallyEarliestItinerary',
    instructions: [{
      content: [
        'In some cases, tickets might be able to form more than one ',
        'valid itinerary. In these cases, choose the airport that comes ',
        'earlier in the alphabet, (for instance, ATL instead of BOS).'
      ].join(''),
      type: 'text'
    }, {
      content: [
        'Input: "JFK-ATL,ATL-JFK,JFK-BOS,JFK-CLE,CLE-JFK"',
        'Output: "JFK-ATL,ATL-JFK,JFK-CLE,CLE-JFK,JFK-BOS"'
      ].join('\n'),
      type: 'code'
    }],
    prerequisiteSkills: ['Graph', 'String Manipulation', 'Topological Sorting'],
    acquiredSkills: ['Dynamic Programming', 'Backtracking'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'sortItinerary',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: 'JFK-ATL,ATL-JFK,JFK-BOS,JFK-CLE,CLE-JFK',
        allowedOutputs: ['JFK-ATL-JFK-CLE-JFK-BOS']
      }]
    }, {
      id: 'HARD_CASE',
      humanReadableName: 'the hard case',
      testCases: [{
        input: 'JFK-ATL,ORD-PHL,JFK-ORD,PHX-LAX,LAX-JFK,PHL-ATL,ATL-PHX',
        allowedOutputs: [
          'JFK-ATL,ATL-PHX,PHX-LAX,LAX-JFK,JFK-ORD,ORD-PHL,PHL-ATL'
        ]
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    performanceTests: []
  }]
};
