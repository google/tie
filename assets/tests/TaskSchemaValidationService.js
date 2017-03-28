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
      verifyHasMainFunctionName: function(task) {
        var mainFunctionName = task.getMainFunctionName();
        return mainFunctionName.length > 0;
      },
      verifyNoDuplicateSkillsInPrompts: function(task) {
        var prerequisiteSkills = task.getPrerequisiteSkills();
        var skillSet = new Set(prerequisiteSkills);
        if (skillSet.size != prerequisiteSkills.length) {
          return false;
        }
        var acquiredSkills = tasks.getAcquiredSkills();
        skillSet = new Set(acquiredSkills);
        return skillSet.size != acquiredSkills.length;
      },
      verifyAtLeastOneCorrectnessTest: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.length > 0;
      },
      verifyCorrectnessTestsHaveAllowedOutputArrays: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        correctnessTests.forEach(function(item, index){
          if (!Array.isArray(correctnessTests.getAllAllowedOutputs())) {
            return false;
          }
        });
        return true;
      },
      verifyCorrectnessTestsHaveNoUndefinedOutputs: function(task) {
        var correctnessTests = task.getCorrectnessTests();
        return correctnessTests.length > 0;
      },
      verifyAtLeastOneAcquiredSkillPerTask: function(task) {
        var acquiredSkills = tasks.getAcquiredSkills();
        return acquiredSkills.length > 0;
      }
    };
  }
]);
