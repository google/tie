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

tie.factory('TaskSchemaValidationService', ['SYSTEM_CODE',
  function(SYSTEM_CODE) {
    var AUXILIARY_CODE_CLASS_NAME = 'AuxiliaryCode.';
    var SYSTEM_CODE_CLASS_NAME = 'System.';
    var VALID_PREFIXES = [
      AUXILIARY_CODE_CLASS_NAME, SYSTEM_CODE_CLASS_NAME];
    var _starterCode;
    var _auxiliaryCode;
    // TODO(eyurko): Update this once we support nonlinear runtimes.
    var ALLOWED_RUNTIMES = ['linear'];
    // TODO(eyurko): Add check that definition occurs at line start.
    var _checkIfFunctionExistsInCode = function(functionName, code) {
      var functionDefinition = 'def ' + functionName;
      return code.indexOf(functionDefinition) !== -1;
    };
    // TODO(eyurko): Add check that function exists in specified class.
    var _checkIfFunctionExistsInClass = function(functionName, 
      className, code) {
      if (functionName.startsWith(className)) {
        var strippedFunctionName = functionName.substring(
          className.length);
        return _checkIfFunctionExistsInCode(
          strippedFunctionName, code);
      }
      return false;
    };
    return {
      init: function(starterCode, auxiliaryCode) {
        _starterCode = starterCode;
        _auxiliaryCode = auxiliaryCode;
      },
      verifyInstructionsAreNotEmpty: function(task) {
        var instructions = task.getInstructions();
        return instructions.length > 0;
      },
      verifyInstructionsIsArrayOfStrings: function(task) {
        var instructions = task.getInstructions();
        return (angular.isArray(instructions) &&
          instructions.every(function(instruction) {
            return angular.isString(instruction);
          }));
      },
      verifyMainFunctionNameIsString: function(task) {
        var mainFunctionName = task.getMainFunctionName();
        return (angular.isString(mainFunctionName) &&
            mainFunctionName.length > 0);
      },
      verifyMainFunctionNameAppearsInStarterCode: function(task) {
        var mainFunctionName = task.getMainFunctionName();
        return _checkIfFunctionExistsInCode(mainFunctionName, 
          _starterCode);
      },
      verifyInputFunctionNameIsNullOrString: function(task) {
        var inputFunctionName = task.getInputFunctionName();
        return (inputFunctionName === null ||
          (VALID_PREFIXES.some(function(prefix) {
            return inputFunctionName.startsWith(prefix);
          }) && angular.isString(inputFunctionName) && 
              inputFunctionName.length > 0));
      },
      verifyInputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task) {
        var inputFunctionName = task.getInputFunctionName();
        return (inputFunctionName === null ||
          _checkIfFunctionExistsInClass(
              inputFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              _auxiliaryCode));
      },
      verifyOutputFunctionNameIsNullOrString: function(task) {
        var outputFunctionName = task.getOutputFunctionName();
        return (outputFunctionName === null ||
          (VALID_PREFIXES.some(function(prefix) {
            return outputFunctionName.startsWith(prefix);
          }) && angular.isString(outputFunctionName) && 
              outputFunctionName.length > 0));
      },
      verifyOutputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task) {
        var outputFunctionName = task.getOutputFunctionName();
        return (outputFunctionName === null ||
          _checkIfFunctionExistsInClass(
              outputFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              _auxiliaryCode));
      },
      verifyPrerequisiteSkillsAreArrayOfStrings: function(task) {
        var prerequisiteSkills = task.getPrerequisiteSkills();
        if (angular.isArray(prerequisiteSkills)) {
          return prerequisiteSkills.every(function(skill) {
            return angular.isString(skill);
          });
        }
        return false;
      },
      verifyAcquiredSkillsAreArrayOfStrings: function(task) {
        var acquiredSkills = task.getAcquiredSkills();
        if (angular.isArray(acquiredSkills)) {
          return acquiredSkills.every(function(skill) {
            return angular.isString(skill);
          });
        }
        return false;
      },
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
      verifyAtLeastOneAcquiredSkill: function(task) {
        var acquiredSkills = task.getAcquiredSkills();
        return acquiredSkills.length > 0;
      },
      verifyCorrectnessTestsAreArray: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return angular.isArray(correctnessTests);
      },
      verifyAtLeastOneCorrectnessTest: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.length > 0;
      },
      verifyCorrectnessTestsHaveNonEmptyAllowedOutputArrays: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.every(function(test) {
          return (
            angular.isArray(test.getAllAllowedOutputs()) &&
            test.getAllAllowedOutputs().length > 0);
        });
      },
      verifyCorrectnessTestsHaveNoUndefinedOutputs: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.every(function(test) {
          return test.getAllAllowedOutputs().every(function(output) {
            return output !== undefined;
          });
        });
      },
      verifyBuggyOutputTestsAreArray: function(task) {
        var buggyOutputTests = task.getBuggyOutputTests();
        return angular.isArray(buggyOutputTests);
      },
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
      verifyPerformanceTestsAreArray: function(task) {
        var performanceTests = task.getPerformanceTests();
        return angular.isArray(performanceTests);
      },
      verifyPerformanceTestsHaveInputDataAtomString: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var inputDataAtom = test.getInputDataAtom();
          return angular.isString(inputDataAtom);
        });
      },
      verifyPerformanceTestsHaveTransformationFunctionName: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var transformationFunctionName = test.getTransformationFunctionName();
          if (!(transformationFunctionName && 
            angular.isString(transformationFunctionName))) {
            return false;
          }
          if (_checkIfFunctionExistsInClass(
              transformationFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              _auxiliaryCode)) {
            return true;
          }
          return _checkIfFunctionExistsInClass(
              transformationFunctionName, SYSTEM_CODE_CLASS_NAME,
              SYSTEM_CODE.python);
        });
      },
      verifyPerformanceTestsHaveLinearExpectedPerformance: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          return ALLOWED_RUNTIMES.includes(test.getExpectedPerformance());
        });
      },
      verifyPerformanceTestsHaveEvaluationFunctionName: function(task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var evaluationFunctionName = test.getEvaluationFunctionName();
          if (evaluationFunctionName === null || 
            !angular.isString(evaluationFunctionName)) {
            return false;
          }
          if (_checkIfFunctionExistsInClass(
              evaluationFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              _auxiliaryCode)) {
            return true;
          }
          return _checkIfFunctionExistsInCode(
            evaluationFunctionName, _starterCode);
        });
      }
    };
  }
]);
