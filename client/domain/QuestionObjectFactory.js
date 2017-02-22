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
  'PromptObjectFactory', 'StyleTestObjectFactory',
  function(PromptObjectFactory, StyleTestObjectFactory) {
    var Question = function(questionDict) {
      this._title = questionDict.title;
      this._starterCode = questionDict.starter_code;
      this._auxiliaryCode = questionDict.auxiliary_code;
      this._prompts = questionDict.prompts.map(function(promptDict) {
        return PromptObjectFactory.create(promptDict);
      });
      this._styleTests = questionDict.style_tests.map(function(styleTestDict) {
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

    Question.prototype.isLastPrompt = function(promptIndex) {
      return promptIndex === this._prompts.length - 1;
    };

    Question.prototype.getPrompts = function() {
      return this._prompts;
    };

    // Static class methods.
    Question.create = function(questionDict) {
      return new Question(questionDict);
    };

    return Question;
  }
]);
