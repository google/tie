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
 * @fileoverview Service for validating data put into a task schema
 * within a question.
 */

tie.factory('TaskSchemaValidationService', [
  'SYSTEM_CODE', 'CLASS_NAME_AUXILIARY_CODE', 'CodeCheckerService',
  function(SYSTEM_CODE, CLASS_NAME_AUXILIARY_CODE, CodeCheckerService) {
    /**
     * Defines the system code's class name.
     *
     * @type {string}
     * @constant
     */
    var CLASS_NAME_SYSTEM_CODE = 'System';
    /**
     * Should be array of strings defining the valid prefixes that can be used
     * for any non-user made code.
     *
     * @type {Array}
     * @constant
     */
    var VALID_PREFIXES = [
      CLASS_NAME_AUXILIARY_CODE + '.', CLASS_NAME_SYSTEM_CODE + '.'];
    // TODO(eyurko): Update this once we support nonlinear runtimes.
    /**
     * Should be array of strings defining what runtimes are allowed for valid,
     * passing performance tests.
     *
     * @type {Array}
     */
    var ALLOWED_RUNTIMES = ['linear'];

    /**
     * @type {string}
     * @private
     */
    var _starterCode;
    /**
     * @type {string}
     * @private
     */
    var _auxiliaryCode;

    return {
      /**
       * Initializes the _starterCode and _auxiliaryCode variables.
       *
       * @param {string} starterCode
       * @param {string} auxiliaryCode
       */
      init: function(starterCode, auxiliaryCode) {
        _starterCode = starterCode;
        _auxiliaryCode = auxiliaryCode;
      },

      /**
       * Checks that the instructions property of the a given Task is not empty.
       * @param {Task} task
       * @returns {boolean}
       */
      verifyInstructionsAreNotEmpty: function(task) {
        var instructions = task.getInstructions();
        return instructions.length > 0;
      },

      /**
       * Checks that the instructions property of the given Task is set to an
       * associative array.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyInstructionsIsAssociativeArray: function(task) {
        var instructions = task.getInstructions();
        return (angular.isArray(instructions) &&
          instructions.every(function(instruction) {
            return (angular.isObject(instruction) &&
                    angular.isString(instruction.content) &&
                    angular.isString(instruction.type));
          }));
      },

      /**
       * Checks that each element of the instructions property for a given
       * Task are all of type 'text' or 'code.'
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyInstructionTypeIsCorrect: function(task) {
        var instructions = task.getInstructions();
        return (instructions.every(function(instruction) {
          return (instruction.type === 'text' || instruction.type === 'code');
        }));
      },

      /**
       * Checks that the main function name property of the given Task is a
       * string.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyMainFunctionNameIsString: function(task) {
        var mainFunctionName = task.getMainFunctionName();
        return (angular.isString(mainFunctionName) &&
            mainFunctionName.length > 0);
      },

      /**
       * Checks that the main function name property of the given Task appears
       * within the starter code.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyMainFunctionNameAppearsInStarterCode: function(task) {
        var mainFunctionName = task.getMainFunctionName();
        return CodeCheckerService.checkIfFunctionExistsInCode(
          mainFunctionName, _starterCode);
      },

      /**
       * Checks that the input function name property of the given Task is
       * either null or a string type.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyInputFunctionNameIsNullOrString: function(task) {
        var inputFunctionName = task.getInputFunctionName();
        return (inputFunctionName === null ||
          (VALID_PREFIXES.some(function(prefix) {
            return inputFunctionName.startsWith(prefix);
          }) && angular.isString(inputFunctionName) &&
              inputFunctionName.length > 0));
      },

      /**
       * Checks that the input function name of a given Task is defined in the
       * auxiliary code if it is not null.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyInputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task) {
        var inputFunctionName = task.getInputFunctionName();
        return (
          inputFunctionName === null ||
          CodeCheckerService.checkIfFunctionExistsInClass(
            inputFunctionName, CLASS_NAME_AUXILIARY_CODE, _auxiliaryCode)
        );
      },

      /**
       * Checks that the output function name of a given Task is either null or
       * a string data type.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyOutputFunctionNameIsNullOrString: function(task) {
        var outputFunctionName = task.getOutputFunctionName();
        return (outputFunctionName === null ||
          (VALID_PREFIXES.some(function(prefix) {
            return outputFunctionName.startsWith(prefix);
          }) && angular.isString(outputFunctionName) &&
              outputFunctionName.length > 0));
      },

      /**
       * Checks that the output function name of a given Task is defined in the
       * same Task's auxiliary code.
       *
       * @param task
       * @returns {boolean}
       */
      verifyOutputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task) {
        var outputFunctionName = task.getOutputFunctionName();
        return (
          outputFunctionName === null ||
          CodeCheckerService.checkIfFunctionExistsInClass(
            outputFunctionName, CLASS_NAME_AUXILIARY_CODE, _auxiliaryCode)
        );
      },

      /**
       * Checks that the auxiliary code contains a a class definition.
       *
       * @returns {boolean}
       */
      verifyAuxiliaryContainsClassDefinition: function() {
        return CodeCheckerService.checkIfClassDefinitionExistsInCode(
          CLASS_NAME_AUXILIARY_CODE, _auxiliaryCode);
      },

      /**
       * Checks that the prerequisite skills property of a given Task is an
       * Array of Strings.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyPrerequisiteSkillsAreArrayOfStrings: function(task) {
        var prerequisiteSkills = task.getPrerequisiteSkills();
        if (angular.isArray(prerequisiteSkills)) {
          return prerequisiteSkills.every(function(skill) {
            return angular.isString(skill);
          });
        }
        return false;
      },

      /**
       * Checks that the acquired skills property of a given Task is an Array
       * of Strings.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyAcquiredSkillsAreArrayOfStrings: function(task) {
        var acquiredSkills = task.getAcquiredSkills();
        if (angular.isArray(acquiredSkills)) {
          return acquiredSkills.every(function(skill) {
            return angular.isString(skill);
          });
        }
        return false;
      },

      /**
       * Checks that there are no duplicate skills between the Prerequisite
       * skills and Acquired Skills in a given Task.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyNoDuplicateSkillsInPrompts: function(task) {
        var prerequisiteSkills = task.getPrerequisiteSkills();
        var skillSet = new Set(prerequisiteSkills);
        if (skillSet.size !== prerequisiteSkills.length) {
          return false;
        }
        var acquiredSkills = task.getAcquiredSkills();
        skillSet = new Set(acquiredSkills);
        return skillSet.size === acquiredSkills.length;
      },

      /**
       * Checks that there is at least one acquired skill within the given Task.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyAtLeastOneAcquiredSkill: function(task) {
        var acquiredSkills = task.getAcquiredSkills();
        return acquiredSkills.length > 0;
      },

      /**
       * Checks that the correctnessTests property for a given Task is an Array.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyCorrectnessTestsAreArray: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return angular.isArray(correctnessTests);
      },

      /**
       * Checks that there is at least one correctness test in the given Task.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyAtLeastOneCorrectnessTest: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.length > 0;
      },

      /**
       * Checks that the correctness tests property does not have empty allowed
       * output arrays.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyCorrectnessTestsHaveNonEmptyAllowedOutputArrays: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.every(function(test) {
          return (
            angular.isArray(test.getAllAllowedOutputs()) &&
            test.getAllAllowedOutputs().length > 0);
        });
      },

      /**
       * Checks that the correctnessTests of a given Task do not have undefined
       * outputs.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyCorrectnessTestsHaveNoUndefinedOutputs: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.every(function(test) {
          return test.getAllAllowedOutputs().every(function(output) {
            return output !== undefined;
          });
        });
      },

      /**
       * Checks that the correctnessTests property for a given Task has tags.
       *
       * @param {TasK} task
       * @returns {boolean}
       */
      verifyCorrectnessTestsHaveTags: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.every(function(test) {
          return angular.isString(test.getTag());
        });
      },

      /**
       * Checks that the BuggyOutputTests property for a given Task is an array.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyBuggyOutputTestsAreArray: function(task) {
        var buggyOutputTests = task.getBuggyOutputTests();
        return angular.isArray(buggyOutputTests);
      },

      /**
       * Checks that the BuggyOutputTests property for a given Task is an array
       * of strings.
       *
       * @param {Task} task
       */
      verifyBuggyOutputTestsHaveArrayOfStringMessages: function(task) {
        var buggyOutputTests = task.getBuggyOutputTests();
        return buggyOutputTests.every(function(test) {
          var messages = test.getMessages();
          return (angular.isArray(messages) &&
            messages.every(function(message) {
              return angular.isString(message);
            }));
        });
      },

      /**
       * Checks that the BuggyOutputTests for a given Task have functions that
       * exist within the auxiliary code.
       *
       * @param {Task} task
       * @returns: {boolean}
       */
      verifyAllBuggyOutputFunctionsAppearInAuxiliaryCode: function(
        task) {
        return task.getBuggyOutputTests().every(function(test) {
          var buggyFunctionName = test.getBuggyFunctionName();
          return CodeCheckerService.checkIfFunctionExistsInClass(
            buggyFunctionName, CLASS_NAME_AUXILIARY_CODE, _auxiliaryCode);
        });
      },

      /**
       * Checks that a given Task's BuggyOutputTestMessages are unique.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyAllBuggyOutputTestMessagesAreUnique: function(task) {
        return task.getBuggyOutputTests().every(function(test) {
          var messages = new Set();
          test.getMessages().forEach(function(message) {
            messages.add(message);
          });
          return messages.size === test.getMessages().length;
        });
      },

      /**
       * Checks that the Performance Tests property of a given task is an array.
       *
       * @param {Array} task
       * @returns {boolean}
       */
      verifyPerformanceTestsAreArray: function(task) {
        var performanceTests = task.getPerformanceTests();
        return angular.isArray(performanceTests);
      },

      /**
       * Checks that the Performance TEsts property of a given Task has an
       * input data atom string.
       *
       * @param {Array} task
       * @returns {boolean}
       */
      verifyPerformanceTestsHaveInputDataAtomString: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var inputDataAtom = test.getInputDataAtom();
          return angular.isString(inputDataAtom);
        });
      },

      /**
       * Checks that performance tests within a given Task have transformation
       * at least one transformation function name.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyPerformanceTestsHaveTransformationFunctionName: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var transformationFunctionName = test.getTransformationFunctionName();
          if (!(transformationFunctionName &&
            angular.isString(transformationFunctionName))) {
            return false;
          }

          return (
            CodeCheckerService.checkIfFunctionExistsInClass(
              transformationFunctionName, CLASS_NAME_AUXILIARY_CODE,
              _auxiliaryCode) ||
            CodeCheckerService.checkIfFunctionExistsInClass(
              transformationFunctionName, CLASS_NAME_SYSTEM_CODE,
              SYSTEM_CODE.python)
          );
        });
      },

      /**
       * Checks that the performance tests for a given task have a linear
       * expected performance.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyPerformanceTestsHaveLinearExpectedPerformance: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          return ALLOWED_RUNTIMES.indexOf(test.getExpectedPerformance()) !== -1;
        });
      },

      /**
       * Checks that the performance tests for a given task have an evaluation
       * function name.
       *
       * @param {Task} task
       * @returns {boolean}
       */
      verifyPerformanceTestsHaveEvaluationFunctionName: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var evaluationFunctionName = test.getEvaluationFunctionName();
          if (evaluationFunctionName === null ||
            !angular.isString(evaluationFunctionName)) {
            return false;
          }
          return (
            CodeCheckerService.checkIfFunctionExistsInClass(
              evaluationFunctionName, CLASS_NAME_AUXILIARY_CODE,
              _auxiliaryCode) ||
            CodeCheckerService.checkIfFunctionExistsInCode(
              evaluationFunctionName, _starterCode)
          );
        });
      }
    };
  }
]);
