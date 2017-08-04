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
  'PerformanceTestObjectFactory', 'CLASS_NAME_AUXILIARY_CODE',
  'CLASS_NAME_SYSTEM_CODE',
  function(
      CorrectnessTestObjectFactory, BuggyOutputTestObjectFactory,
      PerformanceTestObjectFactory, CLASS_NAME_AUXILIARY_CODE,
      CLASS_NAME_SYSTEM_CODE) {
    /**
     * Task objects represent a single task for the user to complete for a
     * question. This includes all of the information, skills, and testing
     * information that can then be used and represented in the UI.
     */

    /**
     * Constructor for Task.
     *
     * @param {dict} taskDict
     * @constructor
     */
    var Task = function(taskDict) {
      /**
       * A list of strings (where each string corresponds to a paragraph in the
       * UI).
       *
       * @type {Array}
       * @private
       */
      this._instructions = taskDict.instructions;

      /**
       * A list of strings where each represents a skill that the user should
       * know in order to successfully complete this problem.
       *
       * @type {Array}
       * @private
       */
      this._prerequisiteSkills = taskDict.prerequisiteSkills;

      /**
       * A list of strings where each represents a skill that the user should
       * be able to acquire from this given task.
       *
       * @type {Array}
       * @private
       */
      this._acquiredSkills = taskDict.acquiredSkills;

      /**
       * A string that matches the name of the function that is input into the
       * student's code - if needed - to run successfully. If not needed,
       * leave null.
       *
       * @type {string|*}
       * @private
       */
      this._inputFunctionName = taskDict.inputFunctionName;

      /**
       * A string that matches the name of a function that is expected to be
       * output from the student's code - if needed - to run successfully. If
       * not needed, leave null.
       *
       * @type {string|*}
       * @private
       */
      this._outputFunctionName = taskDict.outputFunctionName;

      /**
       * A string that matches the name of the main function to be run from
       * the student's code.
       *
       * @type {string}
       * @private
       */
      this._mainFunctionName = taskDict.mainFunctionName;

      /**
       * An Array of CorrectnessTest objects that will be run to determine
       * the correctness of the student's code.
       *
       * @type {Array}
       * @private
       */
      this._correctnessTests = taskDict.correctnessTests.map(
        function(correctnessTestDict) {
          return CorrectnessTestObjectFactory.create(correctnessTestDict);
        }
      );

      /**
       * An Array of BuggyOutputTest objects that will be run to determine
       * if the student's code took into consideration common bugs.
       *
       * @type {Array}
       * @private
       */
      this._buggyOutputTests = taskDict.buggyOutputTests.map(
        function(buggyOutputTestDict) {
          return BuggyOutputTestObjectFactory.create(buggyOutputTestDict);
        }
      );

      /**
       * An Array of PerformanceTest objects that will be run to determine if
       * the student's code meets performance expectations.
       *
       * @type {Array}
       * @private
       */
      this._performanceTests = taskDict.performanceTests.map(
        function(performanceTestDict) {
          return PerformanceTestObjectFactory.create(
            performanceTestDict);
        }
      );
    };

    // Instance methods.
    /**
     * A getter for the _instructions property.
     *
     * @returns {Array}
     */
    Task.prototype.getInstructions = function() {
      return this._instructions;
    };

    /**
     * A getter for the _mainFunctionName property.
     *
     * @returns {string}
     */
    Task.prototype.getMainFunctionName = function() {
      return this._mainFunctionName;
    };

    /**
     * A getter for the _inputFunctionName property.
     *
     * @returns {string|*}
     */
    Task.prototype.getInputFunctionName = function() {
      return this._inputFunctionName;
    };

    /**
     * A getter for the _outputFunctionName property.
     *
     * @returns {string|*}
     */
    Task.prototype.getOutputFunctionName = function() {
      return this._outputFunctionName;
    };

    /**
     * Returns the outputFunctionName but without the class name attached.
     *
     * @returns {string}
     */
    Task.prototype.getOutputFunctionNameWithoutClass = function() {
      if (this._outputFunctionName) {
        if (this._outputFunctionName.indexOf(CLASS_NAME_AUXILIARY_CODE) === 0) {
          return this._outputFunctionName.substring(
            CLASS_NAME_AUXILIARY_CODE.length + 1);
        } else if (
            this._outputFunctionName.indexOf(CLASS_NAME_SYSTEM_CODE) === 0) {
          return this._outputFunctionName.substring(
            CLASS_NAME_SYSTEM_CODE.length + 1);
        }
      }
      return this._outputFunctionName;
    };

    /**
     * A getter for the _correctnessTests property.
     *
     * @returns {Array}
     */
    Task.prototype.getCorrectnessTests = function() {
      return this._correctnessTests;
    };

    /**
     * A getter for the _buggyOutputTests property.
     *
     * @returns {Array}
     */
    Task.prototype.getBuggyOutputTests = function() {
      return this._buggyOutputTests;
    };

    /**
     * A getter for the _performanceTests property.
     *
     * @returns {Array}
     */
    Task.prototype.getPerformanceTests = function() {
      return this._performanceTests;
    };

    /**
     * A getter for the _acquiredSkills property.
     *
     * @returns {Array}
     */
    Task.prototype.getAcquiredSkills = function() {
      return this._acquiredSkills;
    };

    /**
     * A getter for the _prerequisiteSkills property.
     *
     * @returns {Array}
     */
    Task.prototype.getPrerequisiteSkills = function() {
      return this._prerequisiteSkills;
    };

   // Static class methods.
    /**
     * Returns a Task object with the properties based on the dictionary
     * passed into the function.
     *
     * @param {dict} taskDict
     * @returns {Task}
     */
    Task.create = function(taskDict) {
      return new Task(taskDict);
    };

    return Task;
  }
]);
