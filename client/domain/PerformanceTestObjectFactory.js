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
 * @fileoverview Factory for creating new frontend instances of PerformanceTest
 * domain objects.
 */

tie.factory('PerformanceTestObjectFactory', [
  function() {
    var PerformanceTest = function(performanceTestDict) {
      this._inputDataAtom = performanceTestDict.input_data_atom;
      this._transformationFunction =
        performanceTestDict.transformation_function;
      this._expectedPerformance = performanceTestDict.expected_performance;
      this._evaluationFunction = performanceTestDict.evaluation_function;
    };

    // Instance methods.
    PerformanceTest.prototype.getTransformationFunction = function() {
      return this._transformationFunction;
    };

    PerformanceTest.prototype.getInputDataAtom = function() {
      return this._inputDataAtom;
    };

    PerformanceTest.prototype.getExpectedPerformance = function() {
      return this._expectedPerformance;
    };

    PerformanceTest.prototype.getEvaluationFunction = function() {
      return this._evaluationFunction;
    };

    // Static class methods.
    PerformanceTest.create = function(performanceTestDict) {
      return new PerformanceTest(performanceTestDict);
    };

    return PerformanceTest;
  }
]);
