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
 * @fileoverview Factory for creating new frontend instances of BuggyOutputTest
 * domain objects.
 */

tie.factory('BuggyOutputTestObjectFactory', [
  function() {
    var BuggyOutputTest = function(buggyOutputTestDict) {
      this._buggyFunction = buggyOutputTestDict.buggyFunction;
      this._messages = buggyOutputTestDict.messages;
    };

    // Instance methods.
    BuggyOutputTest.prototype.getBuggyFunction = function() {
      return this._buggyFunction;
    };

    BuggyOutputTest.prototype.getMessages = function() {
      return this._messages;
    };

    // Static class methods.
    BuggyOutputTest.create = function(buggyOutputTestDict) {
      return new BuggyOutputTest(buggyOutputTestDict);
    };

    return BuggyOutputTest;
  }
]);
