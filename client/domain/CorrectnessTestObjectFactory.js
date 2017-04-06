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
    };

    // Instance methods.
    CorrectnessTest.prototype.getInput = function() {
      return this._input;
    };

    CorrectnessTest.prototype.matchesOutput = function(output) {
      if (Array.isArray(this._allowedOutputs)) {
        var searchJson = JSON.stringify(output);
        var arrJson = this._allowedOutputs.map(JSON.stringify);
        return arrJson.indexOf(searchJson) !== -1;
      }
      return this._allowedOutputs.indexOf(output) !== -1;
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

    // Static class methods.
    CorrectnessTest.create = function(correctnessTestDict) {
      return new CorrectnessTest(correctnessTestDict);
    };

    return CorrectnessTest;
  }
]);
