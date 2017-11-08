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
 * @fileoverview Question data for Find Closest Value in Binary Search Tree.
 */
/* eslint no-magic-numbers: ["error", {ignore: [1,4,14.7,2.5,24]}]*/
globalData.questions['findClosestValueBst'] = {  // eslint-disable-line dot-notation
  title: 'Find Closest Value in Binary Search Tree',
  starterCode: {
    python:
`def findClosestValue(input):
    root = input[0]
    target = input[1]
`
  },
  auxiliaryCode: {
    python:
`class AuxiliaryCode(object):
        @classmethod
        def deserialize(cls, data):
            class TreeNode(object):
                def __init__(self, x):
                    self.val = x
                    self.left = None
                    self.right = None

                def __str__(self):
                    return self.val

            def constructTree():
                val = next(vals)
                if val == '#':
                    return None
                node = TreeNode(float(val))
                node.left = constructTree()
                node.right = constructTree()
                return node

            inputs = data.split('|')
            vals = iter(inputs[0].split())
            return constructTree(), float(inputs[1])

        @classmethod
        def failToUseAbsoluteDifference(cls, input):
            root = input[0]
            target = input[1]

            candidate = root.left if target < root.val else root.right
            if not candidate:
                return root.val
            closest = cls.failToUseAbsoluteDifference([candidate, target])
            return root.val if (root.val - target) < (closest - target) else closest

        @classmethod
        def failToCompareAll(cls, input):
            root = input[0]
            target = input[1]

            candidate = root.left if target < root.val else root.right
            if not candidate:
                return root.val
            return cls.failToCompareAll([candidate,target])
`
  },
  tasks: [{
    id: 'findClosestValueInBst',
    instructions: [{
      content: [
        'In this question, you need to find the closest value in a' +
        'non-empty binary search tree, given the target value. The ' +
        'target value is given in float format. It\'s guaranteed ',
        'that there\'s only one closest value. You will have the root ' +
        'TreeNode. Each TreeNode has attributes val, left and right.'
      ].join('\n'),
      type: 'text'
    }, {
      content: [
        'For instance, given the following tree and the target value 1.1, ' +
        'you should return 1.',
        '  2',
        ' / \\',
        '1   3'
      ].join('\n'),
      type: 'code'
    }, {
      content: [
        'The tree is represented as a preorder traversal sequence of node ' +
        'values in which \'#\'', 'represents an empty node. For example: ' +
        'the input \'2 1 # # #\' represents the serialized', 'format of a ' +
        'binary tree using preorder order traversal, where root value is 2 ' +
        'and only has a left child with value 1.'
      ].join('\n'),
      type: 'text'
    }, {
      content: [
        '# Definition for a binary tree node.',
        'class TreeNode(object):',
        '  def __init__(self, x):',
        '    self.val = x',
        '    self.left = None',
        '    self.right = None'
      ].join('\n'),
      type: 'code'
    }],
    prerequisiteSkills: ['Binary Search Tree'],
    acquiredSkills: ['Binary Search Tree', 'Recursion', 'Iteration'],
    inputFunctionName: 'AuxiliaryCode.deserialize',
    outputFunctionName: null,
    mainFunctionName: 'findClosestValue',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'GENERAL_CASE',
      humanReadableName: 'the general case',
      testCases: [{
        input: '2 1 # # 3 # #|1.1',
        allowedOutputs: [1]
      }]
    }, {
      id: 'RESULT_SMALLER_THAN_TARGET',
      humanReadableName: 'result smaller than target',
      testCases: [{
        input: '10 3 # 6 4 # # 7 # # #|4.1',
        allowedOutputs: [4]
      }]
    }, {
      id: 'RESULT_LARGER_THAN_TARGET',
      humanReadableName: 'result larger than target',
      testCases: [{
        input: '10 3 # # 14 # 15 14.7 # # 100 # #|14.6',
        allowedOutputs: [14.7]
      }]
    }, {
      id: 'ONE_NODE',
      humanReadableName: 'BST with one node',
      testCases: [{
        input: '2.5 # #|3.2',
        allowedOutputs: [2.5]
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.failToUseAbsoluteDifference',
      ignoredTestSuiteIds: [],
      messages: [
        "Run your code on '2 1 # # 3 # #|2.9' in your head. What is the " +
        "expected result?",
        "It looks like the issue is how you represent the difference " +
        "between values.",
        [
          "Do you use the absolute difference to measure closeness?"
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    performanceTests: []
  }, {
    id: 'findAllPossibleCandidates',
    instructions: [{
      content: [
        'Next, make sure you compare all possible candidates during the ' +
        'search process.'
      ].join(''),
      type: 'text'
    }],
    prerequisiteSkills: ['Binary Search Tree'],
    acquiredSkills: ['Binary Search Tree', 'Recursion', 'Iteration'],
    inputFunctionName: 'AuxiliaryCode.deserialize',
    outputFunctionName: null,
    mainFunctionName: 'findClosestValue',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'SHOULD_RETURN_ROOT',
      humanReadableName: 'should return root',
      testCases: [{
        input: '24 22 # # 25 # #|23.8',
        allowedOutputs: [24]
      }, {
        input: '24 22 # # 25 # #|24.1',
        allowedOutputs: [24]
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.failToCompareAll',
      ignoredTestSuiteIds: [],
      messages: [
        "Run your code on '2 1 # # 3 # #|2.1' in your head. What is the " +
        "expected result?",
        "It looks like your code doesn't correctly consider all possible " +
        "candidate nodes.",
        [
          "Do you compare the root node's value with the candidate selected " +
          "from the subtree?"
        ].join('')
      ]
    }],
    suiteLevelTests: [],
    /**
     * TODO: implement O(logn) performance tests
     * once logarithmic scale is supported
     */
    performanceTests: []
  }],
  styleTests: []
};

