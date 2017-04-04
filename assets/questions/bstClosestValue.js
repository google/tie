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


globalData.questions['rle'] = {  // eslint-disable-line dot-notation
  title: 'Find Closest Value in Binary Search Tree',
  starterCode: {
    python:
`def findClosestValue(target):
    return ""
`
  },
  auxiliaryCode: {
  	python:
`class AuxiliaryCode(object):
	class TreeNode(object):
		def __init__(self, x):
			self.val = x
			self.left = None
			self.right = None

	@classmethod
	def deserialize(cls, data):
		def constructTree():
			val = next(vals)
			if val == '#':
				return None
			node = TreeNode(int(val))
			node.left = constructTree()
			node.right = constructTree()
			return node
		vals = iter(data.split())
		return constructTree()
 
`
  },
  tasks: [{
    instructions: []}]

