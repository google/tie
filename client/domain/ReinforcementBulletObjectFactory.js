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
 * @fileoverview Factory for creating new frontend instances of
 * reinforcementBullet domain objects.
 */

tie.factory('ReinforcementBulletObjectFactory', [
  function() {
    /**
     * ReinforcementBullet objects have all of the information needed to
     * represent a bullet point in the code submission's Reinforcement. Each
     * bullet point should let the user know if they have passed or failed
     * a given task if they had previously failed to complete the task.
     */

    /**
     * Constructor for ReinforcementBullet.
     *
     * @param {boolean} passed Indicates if the reinforcement bullet should show
     *    test as passing or failing.
     * @param {string} content Contains the message to be shown in the bullet.
     * @constructor
     */
    var ReinforcementBullet = function(passed, content) {
      /**
       * Indicates if this bullet is showing a passing or failing task.
       *
       * @type {boolean}
       * @private
       */
      this._passed = passed;
      /**
       * Contains the message to be shown in this bullet.
       *
       * @type {string}
       * @private
       */
      this._content = content;
    };

    // Instance methods.
    /**
     * Checks if this bullet is showing as passed or failing.
     *
     * @returns {boolean}
     */
    ReinforcementBullet.prototype.isPassedBullet = function() {
      return this._passed;
    };

    /**
     * A getter for the _content property.
     * Should return a string that is to be shown next to the bullet.
     *
     * @returns {string}
     */
    ReinforcementBullet.prototype.getContent = function() {
      return this._content;
    };

    /**
     * Returns the name of the correct image to be shown to represent
     * the bullet to indicate visually if it's passing or failing.
     *
     * @returns {string}
     */
    ReinforcementBullet.prototype.getImgName = function() {
      return this._passed ? 'pass.png' : 'fail.png';
    };

    // Static class methods.
    /**
     * Returns a ReinforcementBullet object where it indicates a passing test.
     *
     * @param {string} content The message to be shown next to the bullet.
     * @returns {ReinforcementBullet}
     */
    ReinforcementBullet.createPassedBullet = function(content) {
      return new ReinforcementBullet(true, content);
    };

    /**
     * Returns a ReinforcementBullet object where it indicates a failing test.
     *
     * @param {string} content The message to be shown next to the bullet.
     * @returns {ReinforcementBullet}
     */
    ReinforcementBullet.createFailedBullet = function(content) {
      return new ReinforcementBullet(false, content);
    };

    /**
     * Returns a ReinforcementBulletObject from a dict.
     *
     * @param {Object} dict representing a ReinforcementBullet, which has
     *    the properties 'passed' and 'content'.
     * @returns {ReinforcementBullet}
     */
    ReinforcementBullet.fromDict = function(dict) {
      if (dict.passed) {
        return this.createPassedBullet(dict.content);
      } else {
        return this.createFailedBullet(dict.content);
      }
    };

    /**
     * Returns a dict from a ReinforcementBulletObject.
     *
     * @param {ReinforcementBullet}
     * @returns {Object} dict representing a ReinforcementBullet, which has
     *    the properties 'passed' and 'content'.
     */
    ReinforcementBullet.toDict = function(reinforcementBullet) {
      return {
        passed: reinforcementBullet.isPassedBullet(),
        content: reinforcementBullet.getContent()
      };
    };

    return ReinforcementBullet;
  }
]);
