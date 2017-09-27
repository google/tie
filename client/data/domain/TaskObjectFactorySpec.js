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
 * @fileoverview Unit tests for TaskObject domain objects.
 */

describe('TaskObjectFactory', function() {
  var QuestionObjectFactory;
  var question;

  beforeEach(module('tie'));
  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    QuestionObjectFactory = $injector.get("QuestionObjectFactory");

    question = QuestionObjectFactory.create({
      title: 'title',
      starterCode: 'starterCode',
      tasks: [{
        outputFunctionName: 'AuxiliaryCode.lettersOnly',
        testSuites: [],
        buggyOutputTests: [],
        suiteLevelTests: [],
        performanceTests: []
      }, {
        outputFunctionName: 'System.extendString',
        testSuites: [],
        buggyOutputTests: [],
        suiteLevelTests: [],
        performanceTests: []
      }]
    });
  }));

  describe('getOutputFunctionNameWithoutClass', function() {
    it('should properly get OutputFunctionName without the class name',
      function() {
        expect(question.getTasks()[0].getOutputFunctionNameWithoutClass())
          .toEqual('lettersOnly');
        expect(question.getTasks()[1].getOutputFunctionNameWithoutClass())
          .toEqual('extendString');
      });
  });
});
