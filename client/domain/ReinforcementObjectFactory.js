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
 * @fileoverview Factory for creating new frontend instances of Reinforcement
 * domain objects.
 */

tie.factory('ReinforcementObjectFactory', [
  'ReinforcementBulletObjectFactory', function(
      ReinforcementBulletObjectFactory) {
    var Reinforcement = function(task) {
      this._task = task;
      this._passedTags = {};
      this._pastFailedCases = {};
    };

    // Instance methods.
    Reinforcement.prototype.getBullets = function() {
      var bullets = [];
      for (var tag in this._passedTags) {
        if (this._passedTags[tag]) {
          bullets.push(
            ReinforcementBulletObjectFactory.createPassedBullet(
              "Handles " + tag));
        } else {
          bullets.push(
            ReinforcementBulletObjectFactory.createFailedBullet(
              "Fails " + tag));
        }
      }

      for (var testCase in this._pastFailedCases) {
        if (this._pastFailedCases[testCase]) {
          bullets.push(
            ReinforcementBulletObjectFactory.createPassedBullet(
              "Handles '" + testCase + "'"));
        } else {
          bullets.push(
            ReinforcementBulletObjectFactory.createFailedBullet(
              "Fails on '" + testCase + "'"));
        }
      }

      return bullets;
    };

    Reinforcement.prototype.getTask = function() {
      return this._task;
    };

    // Add a tag to the list of tags the code passes/fails
    Reinforcement.prototype.addToPassedTags = function(tag, passedBool) {
      this._passedTags[tag] = passedBool;
    };

    // Update the pass/fail status of a tag
    Reinforcement.prototype.updatePassedTags = function(tag, passedBool) {
      this._passedTags[tag] = passedBool;
    };

    // Add a test case to the list of failed test cases
    Reinforcement.prototype.addToPastFailedCases = function(
        caseInput, passedBool) {
      this._pastFailedCases[caseInput] = passedBool;
    };

    // Update the status of a passed/failed test case
    Reinforcement.prototype.updatePastFailedCases = function(
        caseInput, passedBool) {
      this._pastFailedCases[caseInput] = passedBool;
    };

    Reinforcement.prototype.getPassedTags = function() {
      return this._passedTags;
    };

    Reinforcement.prototype.getPastFailedCases = function() {
      return this._pastFailedCases;
    };

    Reinforcement.prototype.hasPastFailedCase = function(caseInput) {
      return (caseInput in this._pastFailedCases);
    };

    // Static class methods.
    Reinforcement.create = function(task) {
      return new Reinforcement(task);
    };

    return Reinforcement;
  }
]);
