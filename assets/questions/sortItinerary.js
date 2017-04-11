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
    instructions: [
      [
        'In this question, you will implement the sortItinerary function ',
        'that sort scrembled airline tickets. ',
        'It takes a string that represents airline tickets as input. ',
        'The string can be split by comma into substrings that looks like ',
        '"XXX-YYY". This substring represents a ticket and means the plane ',
        'departs from XXX and arrives at YYY, noticing that departures and ',
        'destinations are not necessarily of length 3. ',
        'To give an example, "LAX-JFK,JFK-ATL" means the itinerary has ',
        'two flights: one from LAX to JFK and the other from JFK to ATL. '
      ].join(''),
      [
        'The function needs to return a string of the sorted itinerary. ',
        'Locations need to be connected by dash. For the given example, ',
        'your function should return the string "LAX-JFK-ATL". '
      ].join(''),
      [
        'All tickets must be used to form an itinerary. ',
        'For now, assume there are no loops in the itinerary and it is ',
        'guaranteed to have one and only one itinerary, ',
        'given the tickets. '
      ].join('')
    ],
    prerequisiteSkills: ['Graph', 'String Manipulation'],
    acquiredSkills: ['Graph Traversal', 'Topological Sorting'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'sortItinerary',
    correctnessTests: [{
      input: 'LAX-JFK',
      allowedOutputs: ['LAX-JFK']
    }, {
      input: 'JFK-ATL,LAX-JFK',
      allowedOutputs: ['LAX-JFK-ATL']
    }, {
      input: 'MUC-LHR,JFK-MUC,SFO-SJC,LHR-SFO',
      allowedOutputs: ['JFK-MUC-LHR-SFO-SJC']
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.connectTicketsInGivenOrder',
      messages: [
        [
          "Connecting tickets in the given order doesn't sort them into ",
          "a valid itinerary since those tickets can be scrambled. ",
          "How about treating each ticket as an directed edge that connects ",
          "two locations? Draw those tickets and locations on paper ",
          "as edges and nodes in a graph. ",
          "Can you traverse all those nodes exactly once in an ordered way? "
        ].join('')
      ]}],
    performanceTests: []
    // The intended performance test below is commented out because framework
    // currently doesn't support nonlinear runtime complexities.
    //
    // performanceTests: [{
    //  inputDataAtom: '',
    //  transformationFunctionName: 'AuxiliaryCode.createLongLinearItinerary',
    //  expectedPerformance: 'quadratic',
    //  evaluationFunctionName: 'sortItinerary'
    // }]
  }, {
    instructions: [
      [
        'Good job! Now we loose the assumption that itinerary do not ',
        'have loops. For instance, the itinerary can be ',
        'NY -> ATL -> NY -> BOS'
      ].join('')
    ],
    prerequisiteSkills: ['Graph', 'String Manupulation'],
    acquiredSkills: ['Dynamic Programming', 'Backtracking'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'sortItinerary',
    correctnessTests: [{
      input: 'JFK-KUL,JFK-NRT,NRT-JFK',
      allowedOutputs: ['JFK-NRT-KUL']
    }, {
      input: 'JFK-SFO,JFK-ATL,SFO-ATL,ATL-JFK,ATL-SFO',
      allowedOutputs: ['JFK-ATL-JFK-SFO-ATl-SFO']
    }, {
      input: 'AXA-TIA,JFK-ANU,ANU-TIA,TIA-AXA',
      allowedOutputs: ['JFK-ANU-TIA-AXA-TIA']
    }],
    buggyOutputTests: [],
    performanceTests: []
  }, {
    instructions: [
      [
        'Sorting work is almost done but you find some tickets can form ',
        'two or more valid itineraries. In this case, the function ',
        'should prefer the one ranks higher alphabetically. '
      ].join(''),
      [
        'For instance, if either visiting ATL or BOS can form a valid ',
        'itinerary, the function should choose ATL over BOS.'
      ].join('')
    ],
    prerequisiteSkills: ['Graph', 'String Manipulation', 'Topological Sorting'],
    acquiredSkills: ['Dynamic Programming', 'Backtracking'],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'sortItinerary',
    correctnessTests: [{
      input: 'JFK-AAA,AAA-JFK,JFK-BBB,JFK-CCC,CCC-JFK',
      allowedOutputs: ['JFK-AAA-JFK-CCC-JFK-BBB']
    }, {
      input: 'JFK-ATL,ORD-PHL,JFK-ORD,PHX-LAX,LAX-JFK,PHL-ATL,ATL-PHX',
      allowedOutputs: ['JFK-ATL-PHX-LAX-JFK-ORD-PHL-ATL']
    }],
    buggyOutputTests: [],
    performanceTests: []
  }],
  styleTests: []
};
