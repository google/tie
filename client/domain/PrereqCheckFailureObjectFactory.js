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
 * @fileoverview Factory for creating new frontend instances of prereqFailure
 * domain objects.
 */

tie.factory('PrereqCheckFailureObjectFactory', [
  'PREREQ_CHECK_TYPE_BAD_IMPORT', 'PREREQ_CHECK_TYPE_MISSING_STARTER_CODE',
  function(
      PREREQ_CHECK_TYPE_BAD_IMPORT, PREREQ_CHECK_TYPE_MISSING_STARTER_CODE) {

    var PrereqCheckFailure = function(type, badImports, starterCode) {
      this._type = type;
      this._badImports = badImports;
      this._starterCode = starterCode;
    };

    // Instance methods.
    PrereqCheckFailure.prototype.getType = function() {
      return this._type;
    };

    PrereqCheckFailure.prototype.isBadImport = function() {
      return (this._type === PREREQ_CHECK_TYPE_BAD_IMPORT);
    };

    PrereqCheckFailure.prototype.isMissingStarterCode = function() {
      return (this._type === PREREQ_CHECK_TYPE_MISSING_STARTER_CODE);
    };

    PrereqCheckFailure.prototype.getBadImports = function() {
      return this._badImports;
    };

    PrereqCheckFailure.prototype.getStarterCode = function() {
      return this._starterCode;
    };

    // Static class methods.
    PrereqCheckFailure.create = function(type, badImports, starterCode) {
      return new PrereqCheckFailure(type, badImports, starterCode);
    };

    return PrereqCheckFailure;
  }
]);
