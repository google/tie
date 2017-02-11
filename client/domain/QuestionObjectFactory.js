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
  function() {
    var Question = function(language, stages) {
      this._language = language;
      // TODO(sll): Component objects in 'stages' may need to be split up more.
      this._stages = angular.copy(stages);
    };

    // Instance methods
    Question.prototype.getLanguage = function() {
      return this._language;
    };

    Question.prototype.getStages = function() {
      return this._stages;
    };

    Question.prototype.getInitialInstructions = function() {
      return this._stages[0].instructions;
    };

    // Static class methods.
    Question.create = function(questionDict) {
      return new Question(
        questionDict.language, questionDict.stages);
    };

    return Question;
  }
]);
