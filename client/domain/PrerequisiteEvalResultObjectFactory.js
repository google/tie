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
 * PreRequisiteCheckResult domain objects.
 */

tie.factory('PrerequisiteEvalResultObjectFactory', [
  function() {
    var PrerequisiteEvalResult = function(
      code, prereqErrorMessage, starterCode) {
      this._code = code;
      this._prereqErrorMessage = prereqErrorMessage;
      this._starterCode = starterCode;
    };

    // Instance methods
    PrerequisiteEvalResult.prototype.getCode = function() {
      return this._code;
    };

    PrerequisiteEvalResult.prototype.getPrereqErrorMessage =
    function() {
      return this._prereqErrorMessage;
    };

    PrerequisiteEvalResult.prototype.getStarterCode = function() {
      return this._starterCode;
    };

    // Static class methods.
    PrerequisiteEvalResult.create = function(
      code, prereqErrorMessage, starterCode) {
      return new PrerequisiteEvalResult(
        code, prereqErrorMessage, starterCode);
    };

    return PrerequisiteEvalResult;
  }
]);
