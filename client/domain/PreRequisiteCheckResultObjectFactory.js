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

tie.factory('PreRequisiteCheckResultObjectFactory', [
  function() {
    var PreRequisiteCheckResult = function(
      code, preRequisiteFailureString, starterCode) {
      this._code = code;
      this._preRequisiteFailureString = preRequisiteFailureString;
      this._starterCode = starterCode;
    };

    // Instance methods
    PreRequisiteCheckResult.prototype.getCode = function() {
      return this._code;
    };

    PreRequisiteCheckResult.prototype.getPreRequisiteFailureString =
    function() {
      return this._preRequisiteFailureString;
    };

    PreRequisiteCheckResult.prototype.getStarterCode = function() {
      return this._starterCode;
    };

    // Static class methods.
    PreRequisiteCheckResult.create = function(
      code, preRequisiteFailureString, starterCode) {
      return new PreRequisiteCheckResult(
        code, preRequisiteFailureString, starterCode);
    };

    return PreRequisiteCheckResult;
  }
]);
