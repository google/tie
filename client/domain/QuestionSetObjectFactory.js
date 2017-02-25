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
 * @fileoverview Factory for creating new frontend instances of QuestionSet
 * objects, which are linear sequences of questions on a particular topic.
 */

tie.factory('QuestionSetObjectFactory', [
  function() {
    var QuestionSet = function(questionSetDict) {
      this._questionIds = questionSetDict.questionIds;
      this._introductionParagraphs = questionSetDict.introductionParagraphs;
    };

    // Instance methods.
    QuestionSet.prototype.getQuestionIds = function() {
      return this._questionIds;
    };

    QuestionSet.prototype.getQuestionId = function(index) {
      if (index < 0 || index >= this._questionIds.length) {
        throw Error(
          'Index ' + index + ' is out of bounds for the number of questions ' +
          'in the current question set.');
      }
      return this._questionIds[index];
    };

    QuestionSet.prototype.getFirstQuestionId = function() {
      return this.getQuestionId(0);
    };

    QuestionSet.prototype.hasQuestionId = function(questionId) {
      return this._questionIds.indexOf(questionId) !== -1;
    };

    QuestionSet.prototype.getNumberOfQuestions = function(questionId) {
      return this._questionIds.length;
    };

    QuestionSet.prototype.getIntroductionParagraphs = function() {
      return this._introductionParagraphs;
    };

    // Static class methods.
    QuestionSet.create = function(questionSetDict) {
      return new QuestionSet(questionSetDict);
    };

    return QuestionSet;
  }
]);
