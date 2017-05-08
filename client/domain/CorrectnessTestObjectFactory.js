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
    var CorrectnessTest = function(correctnessTestDict) {
      this._input = correctnessTestDict.input;
      this._allowedOutputs = correctnessTestDict.allowedOutputs;
      this._message = correctnessTestDict.message;
      this._tag = correctnessTestDict.tag;
    };

    // Instance methods.
    CorrectnessTest.prototype.getInput = function() {
      return this._input;
    };

    CorrectnessTest.prototype.getStringifiedInput = function() {
      if (!this._stringifiedInput) {
        this._stringifiedInput = JSON.stringify(this._input);
      }
      return JSON.stringify(this._input);
    };

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

    CorrectnessTest.prototype.getAnyAllowedOutput = function() {
      return this._allowedOutputs[0];
    };

    CorrectnessTest.prototype.getAllAllowedOutputs = function() {
      return this._allowedOutputs;
    };

    CorrectnessTest.prototype.getMessage = function() {
      return this._message;
    };

    CorrectnessTest.prototype.getTag = function() {
      return this._tag;
    };

    // Static class methods.
    CorrectnessTest.create = function(correctnessTestDict) {
      return new CorrectnessTest(correctnessTestDict);
    };

    return CorrectnessTest;
  }
]);
