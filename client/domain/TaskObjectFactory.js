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
 * @fileoverview Factory for creating new frontend instances of Task domain
 * objects. A task is a specific coding challenge that forms part of a Question.
 */

tie.factory('TaskObjectFactory', [
  'CorrectnessTestObjectFactory', 'BuggyOutputTestObjectFactory',
  'PerformanceTestObjectFactory',
  function(
      CorrectnessTestObjectFactory, BuggyOutputTestObjectFactory,
      PerformanceTestObjectFactory) {
    var Task = function(taskDict) {
      // A list of strings (where each string corresponds to a paragraph in the
      // UI).
      this._instructions = taskDict.instructions;
      this._prerequisiteSkills = taskDict.prerequisiteSkills;
      this._acquiredSkills = taskDict.acquiredSkills;
      this._inputFunctionName = taskDict.inputFunctionName;
      this._outputFunctionName = taskDict.outputFunctionName;
      this._mainFunctionName = taskDict.mainFunctionName;
      this._correctnessTests = taskDict.correctnessTests.map(
        function(correctnessTestDict) {
          return CorrectnessTestObjectFactory.create(correctnessTestDict);
        }
      );
      this._buggyOutputTests = taskDict.buggyOutputTests.map(
        function(buggyOutputTestDict) {
          return BuggyOutputTestObjectFactory.create(buggyOutputTestDict);
        }
      );
      this._performanceTests = taskDict.performanceTests.map(
        function(performanceTestDict) {
          return PerformanceTestObjectFactory.create(
            performanceTestDict);
        }
      );
    };

    // Instance methods.
    Task.prototype.getInstructions = function() {
      return this._instructions;
    };

    Task.prototype.getMainFunctionName = function() {
      return this._mainFunctionName;
    };

    Task.prototype.getInputFunctionName = function() {
      return this._outputFunctionName;
    };

    Task.prototype.getOutputFunctionName = function() {
      return this._outputFunctionName;
    };

    Task.prototype.getCorrectnessTests = function() {
      return this._correctnessTests;
    };

    Task.prototype.getBuggyOutputTests = function() {
      return this._buggyOutputTests;
    };

    Task.prototype.getPerformanceTests = function() {
      return this._performanceTests;
    };

    Task.prototype.getAcquiredSkills = function() {
      return this._acquiredSkills;
    };

    Task.prototype.getPrerequisiteSkills = function() {
      return this._prerequisiteSkills;
    };

   // Static class methods.
    Task.create = function(taskDict) {
      return new Task(taskDict);
    };

    return Task;
  }
]);
