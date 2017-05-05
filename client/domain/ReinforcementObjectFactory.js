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
      this._passedTagsList = {};
      this._pastFailedCasesList = {};
    };

    // Instance methods.
    Reinforcement.prototype.getBullets = function() {
      var bullets = [];
      for (var caseList in this._passedTagsList) {
        if (this._passedTagsList[caseList]) {
          bullets.push(
            ReinforcementBulletObjectFactory.createPassedBullet(
              "Handles " + caseList));
        } else {
          bullets.push(
            ReinforcementBulletObjectFactory.createFailedBullet(
              "Fails " + caseList));
        }
      }

      for (var testCase in this._pastFailedCasesList) {
        if (this._pastFailedCasesList[testCase]) {
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

    Reinforcement.prototype.addToPassedTagsList = function(key, value) {
      this._passedTagsList[key] = value;
    };

    Reinforcement.prototype.addToPastFailedCasesList = function(key, value) {
      this._pastFailedCasesList[key] = value;
    };

    Reinforcement.prototype.getPassedTagsList = function() {
      return this._passedTagsList;
    };

    Reinforcement.prototype.getPastFailedCasesList = function() {
      return this._pastFailedCasesList;
    };

    Reinforcement.prototype.hasPastFailedCase = function(caseInput) {
      return (caseInput in this._pastFailedCasesList);
    };

    // Static class methods.
    Reinforcement.create = function(task) {
      return new Reinforcement(task);
    };

    return Reinforcement;
  }
]);
