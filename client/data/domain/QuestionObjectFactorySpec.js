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
 * @fileoverview Unit tests for QuestionObject domain objects.
 */

describe('QuestionObjectFactory', function() {
  var QuestionObjectFactory;
  var question;
  var questionWithNoTasks;
  var TITLE = "title";
  var STARTER_CODE = "starterCode";
  var AUXILIARY_CODE = "auxiliaryCode";
  var INVALID_LANGUAGE = "invalidLanguage";

  beforeEach(module('tie'));
  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    QuestionObjectFactory = $injector.get(
      'QuestionObjectFactory');
    question = QuestionObjectFactory.create({
      title: TITLE,
      starterCode: STARTER_CODE,
      auxiliaryCode: AUXILIARY_CODE,
      tasks: [{
        testSuites: [],
        buggyOutputTests: [],
        suiteLevelTests: [],
        performanceTests: []
      }, {
        testSuites: [],
        buggyOutputTests: [],
        suiteLevelTests: [],
        performanceTests: []
      }]
    });
    questionWithNoTasks = QuestionObjectFactory.create({
      title: TITLE,
      starterCode: STARTER_CODE,
      auxiliaryCode: AUXILIARY_CODE,
      tasks: []
    });
  }));

  describe('getStarterCodeError', function() {
    it([
      'should throw an error when the starter code language ',
      'is invalid'
    ].join(''), function() {
      var errorFunction = function() {
        question.getStarterCode(INVALID_LANGUAGE);
      };
      expect(errorFunction)
      .toThrowError(Error);
    });
  });

  describe('getAuxiliaryCodeError', function() {
    it([
      'should throw an error when the auxiliary code ',
      'language is invalid'
    ].join(''), function() {
      var errorFunction = function() {
        question.getAuxiliaryCode(INVALID_LANGUAGE);
      };
      expect(errorFunction).toThrowError(Error);
    });
  });

  describe('isLastTask', function() {
    it([
      'should return true if the provided index is ',
      'the index of the last task'
    ].join(''), function() {
      expect(question.isLastTask(2)).toBe(false);
      expect(question.isLastTask(-1)).toBe(false);
      expect(question.isLastTask(1)).toBe(true);
      expect(questionWithNoTasks.isLastTask(1)).toBe(false);
    });
  });
});
