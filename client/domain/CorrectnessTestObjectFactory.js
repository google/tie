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
 * @fileoverview Factory for creating new frontend instances of CorrectnessTest
 * domain objects.
 */


tie.factory('CorrectnessTestObjectFactory', [
  function() {
    /**
     * Constructor for CorrectnessTest
     *
     * @param {dict} correctnessTestDict contains all the properties needed to
     *    make a CorrectnessTest object
     * @constructor
     */
    var CorrectnessTest = function(correctnessTestDict) {
      /**
       * @type{*}
       * @private
       */
      this._input = correctnessTestDict.input;

      /**
       * @type{string}
       * @private
       */
      this._stringifiedInput = JSON.stringify(this._input);

      /**
       * @type {Array}
       * @private
       */
      this._allowedOutputs = correctnessTestDict.allowedOutputs;

      /**
       * @type {string}
       * @private
       */
      this._message = correctnessTestDict.message;

      /**
       * @type {string}
       * @private
       */
      this._tag = correctnessTestDict.tag;
    };

    // Instance methods.
    /**
     * A getter for the _input property.
     * This function should return an object for the input associated with this
     * CorrectnessTest.
     *
     * @returns {*}
     */
    CorrectnessTest.prototype.getInput = function() {
      return this._input;
    };

    /**
     * A getter for the _stringifiedInput property.
     * This function should return a string version of the input associated with
     * this test.
     *
     * @returns {string}
     */
    CorrectnessTest.prototype.getStringifiedInput = function() {
      return this._stringifiedInput;
    };

    /**
     * Checks if the output param matches any of the allowed
     * outputs for this correctness test.
     *
     * @param {*} output the output being checked
     * @returns {boolean} true if output matches, false if not
     */
    CorrectnessTest.prototype.matchesOutput = function(output) {
      var allowedOutputs = this._allowedOutputs;
      var target = output;
      if (angular.isArray(output)) {
        target = JSON.stringify(output);
        allowedOutputs = this._allowedOutputs.map(JSON.stringify);
      }
      return allowedOutputs.some(function(allowedOutput) {
        return angular.equals(allowedOutput, target);
      });
    };

    /**
     * Returns the first object in the _allowedOutputs array
     *
     * @returns {*}
     */
    CorrectnessTest.prototype.getAnyAllowedOutput = function() {
      return this._allowedOutputs[0];
    };

    /**
     * A getter for the _allowedOutputs property.
     * In contrast to getAnyAllowedOutput, this method returns all of the
     * possible allowed outputs.
     *
     * @returns {Array}
     */
    CorrectnessTest.prototype.getAllAllowedOutputs = function() {
      return this._allowedOutputs;
    };

    /**
     * A getter for the _message property.
     * This function should return a string that describes this correctness
     * test.
     *
     * @returns {string}
     */
    CorrectnessTest.prototype.getMessage = function() {
      return this._message;
    };

    /**
     * A getter for the _tag property.
     * This function should return a string that describes the role/purpose
     * of this correctness test to help associate related or similar tests.
     *
     * @returns {string}
     */
    CorrectnessTest.prototype.getTag = function() {
      return this._tag;
    };

    // Static class methods.
    /**
     * Returns a CorrectnessTest object built from the properties specified
     * in the dictionary parameter.
     *
     * @param {dict} correctnessTestDict should specify all the properties
     *    necessary to make this CorrectnessTest
     * @returns {CorrectnessTest}
     */
    CorrectnessTest.create = function(correctnessTestDict) {
      return new CorrectnessTest(correctnessTestDict);
    };

    return CorrectnessTest;
  }
]);
