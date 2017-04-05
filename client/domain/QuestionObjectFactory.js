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
 * @fileoverview Factory for creating new frontend instances of Question
 * domain objects.
 */

tie.factory('QuestionObjectFactory', [
  'TaskObjectFactory', 'StyleTestObjectFactory',
  function(TaskObjectFactory, StyleTestObjectFactory) {
    var Question = function(questionDict) {
      this._title = questionDict.title;
      this._starterCode = questionDict.starterCode;
      this._auxiliaryCode = questionDict.auxiliaryCode;
      this._tasks = questionDict.tasks.map(function(taskDict) {
        return TaskObjectFactory.create(taskDict);
      });
      this._styleTests = questionDict.styleTests.map(function(styleTestDict) {
        return StyleTestObjectFactory.create(styleTestDict);
      });
    };

    // Instance methods.
    Question.prototype.getTitle = function() {
      return this._title;
    };

    Question.prototype.getStarterCode = function(language) {
      if (!this._starterCode.hasOwnProperty(language)) {
        throw Error('No starter code exists for language: ' + language);
      }
      return this._starterCode[language];
    };

    Question.prototype.getAuxiliaryCode = function(language) {
      if (!this._auxiliaryCode.hasOwnProperty(language)) {
        throw Error('No auxiliary code exists for language: ' + language);
      }
      return this._auxiliaryCode[language];
    };

    Question.prototype.isLastTask = function(taskIndex) {
      return taskIndex === this._tasks.length - 1;
    };

    Question.prototype.getTasks = function() {
      return this._tasks;
    };

    Question.prototype.getStyleTests = function() {
      return this._styleTests;
    };

    // Static class methods.
    Question.create = function(questionDict) {
      return new Question(questionDict);
    };

    return Question;
  }
]);
