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
 * within a question, before that schema is committed.
 */

tie.factory('TaskSchemaValidationService', [
  function() {
    return {
      verifyInstructionsAreNotEmpty: function(task) {
        var instructions = task.getInstructions();
        return instructions.length > 0;
      },
      verifyInstructionsIsArrayOfStrings: function(task) {
        var instructions = task.getInstructions();
        if (!Array.isArray(instructions)) {
          return false;
        }
        instructions.forEach(function(item, index) {
          if (!(typeof item === 'string' || item instanceof String)) {
            return false;
          }
        });
        return true;
      },
      verifyMainFunctionNameIsString: function(task) {
        var mainFunctionName = task.getMainFunctionName();
        if (!(typeof mainFunctionName === 'string' ||
          mainFunctionName instanceof String)) {
          return false;
        }
        return mainFunctionName.length > 0;
      },
      verifyInputFunctionNameIsNullOrString: function(task) {
        var inputFunctionName = task.getInputFunctionName();
        if (inputFunctionName === null) {
          return true;
        }
        return (typeof inputFunctionName === 'string' ||
          inputFunctionName instanceof String);
      },
      verifyInputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task, auxiliaryCode) {
        var inputFunctionName = task.getInputFunctionName();
        if (inputFunctionName === null) {
          return true;
        }
        var auxiliaryCodeClassName = 'AuxiliaryCode.';
        if (inputFunctionName.startsWith(auxiliaryCodeClassName)) {
          var functionName = inputFunctionName.substring(
            auxiliaryCodeClassName.length);
          return auxiliaryCode.indexOf(functionName) !== -1;
        }
        return false;
      },
      verifyOutputFunctionNameIsNullOrString: function(task) {
        var outputFunctionName = task.getOutputFunctionName();
        if (outputFunctionName === null) {
          return true;
        }
        return (typeof outputFunctionName === 'string' ||
          outputFunctionName instanceof String);
      },
      verifyOutputFunctionNameAppearsInAuxiliaryCodeIfNotNull: function(
        task, auxiliaryCode) {
        var outputFunctionName = task.getOutputFunctionName();
        if (outputFunctionName === null) {
          return true;
        }
        var auxiliaryCodeClassName = 'AuxiliaryCode.';
        if (outputFunctionName.startsWith(auxiliaryCodeClassName)) {
          var functionName = outputFunctionName.substring(
            auxiliaryCodeClassName.length);
          return auxiliaryCode.indexOf(functionName) !== -1;
        }
        return false;
      },
      verifyPrerequisiteSkillsAreArray: function(task) {
        var prerequisiteSkills = task.getPrerequisiteSkills();
        return Array.isArray(prerequisiteSkills);
      },
      verifyAcquiredSkillsAreArray: function(task) {
        var acquiredSkills = task.getAcquiredSkills();
        return Array.isArray(acquiredSkills);
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
        return Array.isArray(correctnessTests);
      },
      verifyAtLeastOneCorrectnessTest: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.length > 0;
      },
      verifyCorrectnessTestsHaveNonEmptyAllowedOutputArrays: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        correctnessTests.forEach(function(item, index) {
          if (!Array.isArray(item.getAllAllowedOutputs())) {
            return false;
          } else if (item.getAllAllowedOutputs().length === 0) {
            return false;
          }
        });
        return true;
      },
      verifyCorrectnessTestsHaveNoUndefinedOutputs: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        correctnessTests.forEach(function(item, index) {
          var outputs = item.getAllAllowedOutputs();
          outputs.forEach(function(item, index) {
            if (item === undefined) {
              return false;
            }
          });
        });
        return true;
      },
      verifyBuggyOutputTestsAreArray: function(task) {
        var buggyOutputTests = task.getBuggyOutputTests();
        return Array.isArray(buggyOutputTests);
      },
      verifyBuggyOutputTestsHaveArrayOfStringMessages: function(task) {
        var buggyOutputTests = task.getBuggyOutputTests();
        buggyOutputTests.forEach(function(item, index) {
          if (!('messages' in item)) {
            return false;
          }
          if (!Array.isArray(item['messages'])) {
            return false;
          }
          item['messages'].forEach(function(item, index) {
            if (!(typeof item === 'string' || item instanceof String)) {
              return false;
            }
          });
        });
        return true;
      },
      verifyPerformanceTestsAreArray: function(task) {
        var performanceTests = task.getPerformanceTests();
        return Array.isArray(performanceTests);
      },
      verifyPerformanceTestsHaveInputDataAtomStringIfPresent: function(
        task) {
        var performanceTests = task.getPerformanceTests();
        performanceTests.forEach(function(item, index) {
          if (!('inputDataAtom' in item)) {
            return false;
          }
          var inputDataAtom = item['inputDataAtom'];
          if (!(typeof inputDataAtom === 'string' ||
            inputDataAtom instanceof String)) {
            return false;
          }
        });
        return true;
      },
      verifyPerformanceTestsHaveNonEmptyTransformationFunctionNameIfPresent: function(
        task) {
        var performanceTests = task.getPerformanceTests();
        performanceTests.forEach(function(item, index) {
          if (!('transformationFunctionName' in item)) {
            return false;
          }
          var transformationFunctionName = item['transformationFunctionName'];
          if (!(typeof transformationFunctionName === 'string' ||
            transformationFunctionName instanceof String)) {
            return false;
          }
          var auxiliaryCodeClassName = 'AuxiliaryCode.';
          if (transformationFunctionName.startsWith(auxiliaryCodeClassName)) {
            var functionName = transformationFunctionName.substring(
              auxiliaryCodeClassName.length);
            return auxiliaryCode.indexOf(functionName) !== -1;
          }
          return false;
          var systemCodeClassName = 'System.';
          if (transformationFunctionName.startsWith(systemCodeClassName)) {
            // TODO(eyurko): Define system code in constant so we can access it here.
            return true;
          }
          return false;
        });
        return true;
      },
      verifyPerformanceTestsHaveLinearExpectedPerformanceIfPresent: function(
        task) {
        var performanceTests = task.getPerformanceTests();
        performanceTests.forEach(function(item, index) {
          if (!('transformationFunctionName' in item)) {
            return false;
          }
          var transformationFunctionName = item['transformationFunctionName'];
          if (!(typeof transformationFunctionName === 'string' ||
            transformationFunctionName instanceof String)) {
            return false;
          }
        });
        return true;
      },
      verifyPerformanceTestsHaveEvaluationFunctionNameIfPresent: function(
        task, auxiliaryCode, starterCode) {
        var performanceTests = task.getPerformanceTests();
        performanceTests.forEach(function(item, index) {
          var evaluationFunctionName = item.getEvaluationFunctionName();
          if (evaluationFunctionName === null) {
            return false;
          }
          if (!(typeof evaluationFunctionName === 'string' ||
            evaluationFunctionName instanceof String)) {
            return false;
          }
          var auxiliaryCodeClassName = 'AuxiliaryCode.';
          if (evaluationFunctionName.startsWith(auxiliaryCodeClassName)) {
            var functionName = evaluationFunctionName.substring(
              auxiliaryCodeClassName.length);
            return auxiliaryCode.indexOf(functionName) !== -1;
          }
          var functionDefinition = 'def ' + evaluationFunctionName;
          return starterCode.indexOf(functionDefinition) !== -1
        });
        return true;
      }
    };
  }
]);
