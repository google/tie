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
    // TODO(eyurko): Update this once we support nonlinear runtimes.
    var ALLOWED_RUNTIMES = ['linear'];
    var _checkIfFunctionExistsInCode = function(functionName, code) {
      var functionDefinition = 'def ' + functionName;
      return code.indexOf(functionDefinition) !== -1;
    }
    var _checkIfFunctionExistsInClass = function(functionName, 
      className, code) {
      if (functionName.startsWith(className)) {
        var strippedFunctionName = functionName.substring(
          className.length);
        return _checkIfFunctionExistsInCode(
          strippedFunctionName, code);
      }
      return false;
    }
    return {
      verifyInstructionsAreNotEmpty: function(task) {
        var instructions = task.getInstructions();
        return instructions.length > 0;
      },
      verifyInstructionsIsArrayOfStrings: function(task) {
        var instructions = task.getInstructions()
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
      verifyMainFunctionNameAppearsInStarterCode: function(
        task, starterCode) {
        var mainFunctionName = task.getMainFunctionName();
        return _checkIfFunctionExistsInCode(mainFunctionName, starterCode);
      },
      verifyInputFunctionNameIsNullOrString: function(task) {
        var inputFunctionName = task.getInputFunctionName();
        return (inputFunctionName === null ||
          angular.isString(inputFunctionName));
      },
      verifyInputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task, auxiliaryCode) {
        var inputFunctionName = task.getInputFunctionName();
        return (inputFunctionName === null ||
          _checkIfFunctionExistsInClass(
              inputFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              auxiliaryCode));
      },
      verifyOutputFunctionNameIsNullOrString: function(task) {
        var outputFunctionName = task.getOutputFunctionName();
        return (outputFunctionName === null ||
          angular.isString(outputFunctionName));
      },
      verifyOutputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task, auxiliaryCode) {
        var outputFunctionName = task.getOutputFunctionName();
        return (outputFunctionName === null ||
          _checkIfFunctionExistsInClass(
              outputFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              auxiliaryCode));
      },
      verifyPrerequisiteSkillsAreArray: function(task) {
        var prerequisiteSkills = task.getPrerequisiteSkills();
        return angular.isArray(prerequisiteSkills);
      },
      verifyAcquiredSkillsAreArray: function(task) {
        var acquiredSkills = task.getAcquiredSkills();
        return angular.isArray(acquiredSkills);
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
        })
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
      verifyPerformanceTestsHaveTransformationFunctionName: function(
        task, auxiliaryCode) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var transformationFunctionName = test.getTransformationFunctionName();
          if (!(transformationFunctionName && 
            angular.isString(transformationFunctionName))) {
            return false;
          }
          if (_checkIfFunctionExistsInClass(
              transformationFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              auxiliaryCode)){
            return true;
          }
          return _checkIfFunctionExistsInClass(
              transformationFunctionName, SYSTEM_CODE_CLASS_NAME,
              SYSTEM_CODE['python']);
        });
      },
      verifyPerformanceTestsHaveLinearExpectedPerformance: function(
        task) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          return ALLOWED_RUNTIMES.includes(test.getExpectedPerformance());
        });
      },
      verifyPerformanceTestsHaveEvaluationFunctionName: function(
        task, auxiliaryCode, starterCode) {
        var performanceTests = task.getPerformanceTests();
        return performanceTests.every(function(test) {
          var evaluationFunctionName = test.getEvaluationFunctionName();
          if (evaluationFunctionName === null || 
            !angular.isString(evaluationFunctionName)) {
            return false;
          }
          if (_checkIfFunctionExistsInClass(
              evaluationFunctionName, AUXILIARY_CODE_CLASS_NAME, 
              auxiliaryCode)) {
            return true;
          }
          return _checkIfFunctionExistsInCode(
            evaluationFunctionName, starterCode);
        });
      }
    };
  }
]);
