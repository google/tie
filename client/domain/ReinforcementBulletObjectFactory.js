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

    var ReinforcementBullet = function(passed, content) {
      this._passed = passed;
      if (passed) {
        this._content = "<span style=\"color: green\">☑ </span>" + content;
      } else {
        this._content = "<span style=\"color: red\">☒  </span>" + content;
      }
    };

    // Instance methods.
    ReinforcementBullet.prototype.isPassedBullet = function() {
      return this._passed;
    };

    ReinforcementBullet.prototype.getContent = function() {
      return this._content;
    };

    // Static class methods.
    ReinforcementBullet.createPassedBullet = function(content) {
      return new ReinforcementBullet(true, content);
    };

    ReinforcementBullet.createFailedBullet = function(content) {
      return new ReinforcementBullet(false, content);
    };

    return ReinforcementBullet;
  }
]);
