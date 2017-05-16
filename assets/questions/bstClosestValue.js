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
globalData.questions['bstClosestValue'] = {  // eslint-disable-line dot-notation
  title: 'Find Closest Value in Binary Search Tree',
  starterCode: {
    python:
`def findClosestValue(input):
    root = input[0]
    target = input[1]

    #TODO : write your code after here
    return ""
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
        def failToUseAbsoluteDiff(cls, input):
            root = input[0]
            target = input[1]

            kid = root.left if target < root.val else root.right
            if not kid:
                return root.val
            closest = cls.failToUseAbsoluteDiff([kid,target])
            return root.val if (root.val - target) < (closest - target) else closest

        @classmethod
        def failToCompareAll(cls, input):
            root = input[0]
            target = input[1]

            kid = root.left if target < root.val else root.right
            if not kid:
                return root.val
            return cls.failToCompareAll([kid,target])
`
  },
  tasks: [{
    instructions: [
      {
        content:
        [
          'In this question, you need to find the closest value in a' +
          ' non-empty binary search tree ',
          'given the target value. The target value is given in float' +
          ' format. It\'s guaranteed ',
          'that there\'s only one closest value. You will have the root' +
          ' TreeNode. Each TreeNode ',
          'has attributes val, left and right.'
        ].join(''),
        type: 'text'
      },
      {
        content:
        [
          'For instance, given the following tree and the target value 1.1,' +
          ' you should return 1.',
          '  2',
          ' / \\',
          '1   3'
        ].join('\n'),
        type: 'code'
      },
      {
        content:
        [
          'The tree is represented as a preorder traversal sequence of node' +
          ' values in which \'#\'',
          'represents an empty node. For example: the input \'2 1 # # #\'' +
          ' represents the serialized',
          'format of a binary tree using preorder order traversal, where' +
          ' root value is 2 and only has a left child with value 1.'
        ].join('\n'),
        type: 'text'
      },
      {
        content:
        [
          '#Definition for a binary tree node.',
          'class TreeNode(object):',
          '  def __init__(self, x):',
          '    self.val = x',
          '    self.left = None',
          '    self.right = None'
        ].join('\n'),
        type: 'code'
      }
    ],
    prerequisiteSkills: ['Binary Search Tree'],
    acquiredSkills: ['Binary Search Tree', 'Recurssion', 'Iteration'],
    inputFunctionName: 'AuxiliaryCode.deserialize',
    outputFunctionName: null,
    mainFunctionName: 'findClosestValue',
    correctnessTests: [{
      input: '2 1 # # 3 # #|1.1',
      allowedOutputs: [1],
      tag: 'simple BST'
    },
    {
      input: '10 3 # 6 4 # # 7 # # #|4.1',
      allowedOutputs: [4],
      tag: 'result smaller than target'
    },
    {
      input: '10 3 # # 14 # 15 14.7 # # 100 # #|14.6',
      allowedOutputs: [14.7],
      tag: 'result larger than target'
    },
    {
      input: '2.5 # #|3.2',
      allowedOutputs: [2.5],
      tag: 'BST with one node'
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.failToUseAbsoluteDiff',
      messages: [
        "Run your code on '2 1 # # 3 # #|2.9' in your head, what is the" +
        "expected result?",
        "It looks like the issue is how you represent the difference" +
        "between values",
        [
          "Do you use the absolute difference to measure closeness?"
        ].join('')
      ]
    }],
    performanceTests: []
  }, {
    instructions: [
      {
        content:
        [
          'Next, make sure you compare all possible candidates'
        ].join(''),
        type: 'text'
      }
    ],
    prerequisiteSkills: ['Binary Search Tree'],
    acquiredSkills: ['Binary Search Tree', 'Recurssion', 'Iteration'],
    inputFunctionName: 'AuxiliaryCode.deserialize',
    outputFunctionName: null,
    mainFunctionName: 'findClosestValue',
    correctnessTests: [{
      input: '24 22 # # 25 # #|23.8',
      allowedOutputs: [24],
      tag: 'should return root'
    },
    {
      input: '24 22 # # 25 # #|24.1',
      allowedOutputs: [24],
      tag: 'should return root'
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.failToCompareAll',
      messages: [
        "Run your code on '2 1 # # 3 # #|2.1' in your head, what is the" +
        "expected result?",
        "It looks like the issue is whether or not you consider all possible" +
        "candidate nodes",
        [
          "Do you compare the root node's value with the most possible value" +
          "from subtree?"
        ].join('')
      ]
    }],
    /**
     * TODO: implement O(logn) performance tests
     * once logarithmic scale is supported
     */
    performanceTests: []
  }],
  styleTests: []
};

