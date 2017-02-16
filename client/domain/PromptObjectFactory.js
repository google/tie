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
 * @fileoverview Factory for creating new frontend instances of Prompt domain
 * objects.
 */

tie.factory('PromptObjectFactory', [
  'CorrectnessTestObjectFactory', 'BuggyOutputTestObjectFactory',
  'PerformanceTestObjectFactory',
  function(
      CorrectnessTestObjectFactory, BuggyOutputTestObjectFactory,
      PerformanceTestObjectFactory) {
    var Prompt = function(promptDict) {
      // A list of strings (where each string corresponds to a paragraph in the
      // UI).
      this._instructions = promptDict.instructions;
      this._prerequisiteSkills = promptDict.prerequisite_skills;
      this._acquiredSkills = promptDict.acquired_skills;
      this._inputFunction = promptDict.input_function;
      this._outputFunction = promptDict.output_function;
      this._mainFunction = promptDict.main_function;
      this._correctnessTests = promptDict.correctness_tests.map(
        function(correctnessTestDict) {
          return CorrectnessTestObjectFactory.create(correctnessTestDict);
        }
      );
      this._buggyOutputTests = promptDict.buggy_output_tests.map(
        function(buggyOutputTestDict) {
          return BuggyOutputTestObjectFactory.create(buggyOutputTestDict);
        }
      );
      this._performanceTests = promptDict.performance_tests.map(
        function(performanceTestDict) {
          return PerformanceTestObjectFactory.create(
            performanceTestDict);
        }
      );
    };

    // Instance methods.
    Prompt.prototype.getInstructions = function() {
      return this._instructions;
    };

    Prompt.prototype.getMainFunction = function() {
      return this._mainFunction;
    };

    Prompt.prototype.getCorrectnessTests = function() {
      return this._correctnessTests;
    };

    Prompt.prototype.getBuggyOutputTests = function() {
      return this._buggyOutputTests;
    };

    // Static class methods.
    Prompt.create = function(promptDict) {
      return new Prompt(promptDict);
    };

    return Prompt;
  }
]);
