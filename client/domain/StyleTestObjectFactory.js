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
 * @fileoverview Factory for creating new frontend instances of StyleTest
 * domain objects.
 */

tie.factory('StyleTestObjectFactory', [
  function() {
    var StyleTest = function(styleTestDict) {
      this._evaluationFunctionName = styleTestDict.evaluationFunctionName;
      this._expectedOutput = styleTestDict.expectedOutput;
      this._message = styleTestDict.message;
    };

    // Instance methods.
    StyleTest.prototype.getEvaluationFunctionName = function() {
      return this._evaluationFunctionName;
    };

    // Static class methods.
    StyleTest.create = function(styleTestDict) {
      return new StyleTest(styleTestDict);
    };

    return StyleTest;
  }
]);
