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
        for (var i = 0; i < instructions.length; i++) {
          var instruction = instructions[i];
          if (!(typeof instruction === 'string' ||
            instruction instanceof String)) {
            return false;
          }
        }
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
      verifyMainFunctionNameAppearsInStarterCode: function(
        task, starterCode) {
        var mainFunctionName = task.getMainFunctionName();
        var functionDefinition = 'def ' + mainFunctionName;
        return starterCode.indexOf(functionDefinition) !== -1;
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
        for (var i = 0; i < correctnessTests.length; i++) {
          var test = correctnessTests[i];
          if (!Array.isArray(test.getAllAllowedOutputs())) {
            return false;
          } else if (test.getAllAllowedOutputs().length === 0) {
            return false;
          }
        }
        return true;
      },
      verifyCorrectnessTestsHaveNoUndefinedOutputs: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        for (var i = 0; i < correctnessTests.length; i++) {
          var outputs = correctnessTests[i].getAllAllowedOutputs();
          for (var j = 0; j < outputs.length; j++) {
            if (outputs[j] === undefined) {
              return false;
            }
          }
        }
        return true;
      },
      verifyBuggyOutputTestsAreArray: function(task) {
        var buggyOutputTests = task.getBuggyOutputTests();
        return Array.isArray(buggyOutputTests);
      },
      verifyBuggyOutputTestsHaveArrayOfStringMessages: function(task) {
        var buggyOutputTests = task.getBuggyOutputTests();
        for (var i = 0; i < buggyOutputTests.length; i++) {
          var messages = buggyOutputTests[i].getMessages();
          if (!messages) {
            return false;
          }
          if (!Array.isArray(messages)) {
            return false;
          }
          for (var j = 0; j < messages.length; j++) {
            var message = messages[j];
            if (!(typeof message === 'string' || message instanceof String)) {
              return false;
            }
          }
        }
        return true;
      },
      verifyPerformanceTestsAreArray: function(task) {
        var performanceTests = task.getPerformanceTests();
        return Array.isArray(performanceTests);
      },
      verifyPerformanceTestsHaveInputDataAtomString: function(
        task) {
        var performanceTests = task.getPerformanceTests();
        for (var i = 0; i < performanceTests.length; i++) {
          var test = performanceTests[i];
          var inputDataAtom = test.getInputDataAtom();
          if (!inputDataAtom) {
            return false;
          }
          if (!(typeof inputDataAtom === 'string' ||
            inputDataAtom instanceof String)) {
            return false;
          }
        }
        return true;
      },
      verifyPerformanceTestsHaveNonEmptyTransformationFunctionName: function(
        task, auxiliaryCode) {
        var performanceTests = task.getPerformanceTests();
        for (var i = 0; i < performanceTests.length; i++) {
          var test = performanceTests[i];
          var transformationFunctionName = test.getTransformationFunctionName();
          if (!transformationFunctionName) {
            return false;
          }
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
          var systemCodeClassName = 'System.';
          if (transformationFunctionName.startsWith(systemCodeClassName)) {
            // TODO(eyurko): Make system code accessible by testing framework.
            return true;
          }
          return false;
        }
        return true;
      },
      verifyPerformanceTestsHaveLinearExpectedPerformance: function(
        task) {
        var performanceTests = task.getPerformanceTests();
        for (var i = 0; i < performanceTests.length; i++) {
          var test = performanceTests[i];
          // TODO(eyurko): Update this once we support nonlinear runtimes.
          if (test.getExpectedPerformance() !== 'linear') {
            return false;
          }
        }
        return true;
      },
      verifyPerformanceTestsHaveEvaluationFunctionName: function(
        task, auxiliaryCode, starterCode) {
        var performanceTests = task.getPerformanceTests();
        for (var i = 0; i < performanceTests.length; i++) {
          var test = performanceTests[i];
          var evaluationFunctionName = test.getEvaluationFunctionName();
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
          return starterCode.indexOf(functionDefinition) !== -1;
        }
        return true;
      }
    };
  }
]);
