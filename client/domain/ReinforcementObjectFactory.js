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
    /**
    * The reinforcement object contains the current state of reinforcement
    * comments about a particular task in a question.
    */

    /**
     * Constructor for Reinforcement.
     *
     * @param {Task} task
     * @constructor
     */
    var Reinforcement = function(task) {
      /**
       * Task object associated with this Reinforcement object.
       *
       * @type {Task}
       * @private
       */
      this._task = task;

      /**
       * Dictionary of strings containing the tags that the code has
       * passed and failed. A tag is considered "failed" if at least one of the
       * correctness tests corresponding to it have failed.
       * Key: the tag
       * Value: Boolean indicating whether code passed the tag.
       *
       * @type {dict}
       * @private
       */
      this._passedTags = {};

      /**
       * List of test cases that will be displayed in the reinforcement
       * comments and the corresponding pass/fail status.
       * Key: Stringified input of test case.
       * Value: Boolean indicating whether the code passed the test case.
       *
       * @type {dict}
       * @private
       */
      this._pastFailedCases = {};
    };

    // Instance methods.
    /**
     * This function creates an array of ReinforcementBullet objects
     * based on the data in this object's _passedTags property.
     *
     * @returns {Array}
     */
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

      for (var stringifiedTestCase in this._pastFailedCases) {
        if (this._pastFailedCases[stringifiedTestCase]) {
          bullets.push(
            ReinforcementBulletObjectFactory.createPassedBullet(
              "Handles '" + stringifiedTestCase + "'"));
        } else {
          bullets.push(
            ReinforcementBulletObjectFactory.createFailedBullet(
              "Fails on '" + stringifiedTestCase + "'"));
        }
      }

      return bullets;
    };

    /**
     * A getter for the _task property.
     * Should return a Task object that corresponds with this Reinforcement.
     *
     * @returns {Task}
     */
    Reinforcement.prototype.getTask = function() {
      return this._task;
    };

    /**
     * This function adds a given tag and its corresponding status to the
     * _passedTags property.
     *
     * @param {Tag} tag The tag to be added
     * @param {boolean} tagPassed The pass/fail status of the new tag.
     */
    Reinforcement.prototype.addPassedTag = function(tag, tagPassed) {
      this._passedTags[tag] = tagPassed;
    };

    /**
     * This function updates the given tag's pass/fail status in the _passedTags
     * property.
     *
     * @param {Tag} tag The tag to be changed
     * @param {boolean} tagPassed The new status for the tag
     */
    Reinforcement.prototype.updatePassedTag = function(tag, tagPassed) {
      this._passedTags[tag] = tagPassed;
    };

    /**
     * This function adds a past failed case to the _pastFailedCase list.
     *
     * @param {String} stringifiedCaseInput The stringified input that was used
     *    for this test case.
     * @param {boolean} casePassed The pass/fail status for this test case.
     */
    Reinforcement.prototype.addPastFailedCase = function(
        stringifiedCaseInput, casePassed) {
      this._pastFailedCases[stringifiedCaseInput] = casePassed;
    };

    /**
     * This function updates the status of a passed/failed test case.
     *
     * @param {String} stringifiedCaseInput The stringified input that was used
     *    for this test case.
     * @param {boolean} casePassed The pass/fail status for this test case.
     */
    Reinforcement.prototype.updatePastFailedCase = function(
        stringifiedCaseInput, casePassed) {
      this._pastFailedCases[stringifiedCaseInput] = casePassed;
    };

    /**
     * A getter for the _passedTags property.
     *
     * @returns {dict}
     */
    Reinforcement.prototype.getPassedTags = function() {
      return this._passedTags;
    };

    /**
     * A getter for the _pastFailedCases property.
     * @returns {dict}
     */
    Reinforcement.prototype.getPastFailedCases = function() {
      return this._pastFailedCases;
    };

    /**
     * Checks if this object has any cases that previously failed. In other
     * words, checks if there are any cases present in the _pastFailedCases
     * list.
     *
     * @param {String} stringifiedCaseInput
     * @returns {boolean}
     */
    Reinforcement.prototype.hasPastFailedCase = function(stringifiedCaseInput) {
      return this._pastFailedCases.hasOwnProperty(stringifiedCaseInput);
    };

    // Static class methods.
    /**
     * Returns a Reinforcement object based around the given task parameter.
     *
     * @param {Task} task
     * @returns {Reinforcement}
     */
    Reinforcement.create = function(task) {
      return new Reinforcement(task);
    };

    return Reinforcement;
  }
]);
