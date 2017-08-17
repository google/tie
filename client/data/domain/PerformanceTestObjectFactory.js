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

tieData.factory('PerformanceTestObjectFactory', [
  function() {
    /**
     * PerformanceTest encapsulates all of the information needed to
     * test if the student's code meets performance expectations.
     */

    /**
     * Constructor for PerformanceTest
     *
     * @param {dict} performanceTestDict
     * @constructor
     */
    var PerformanceTest = function(performanceTestDict) {
      /**
       * Input needed to perform this Performance test.
       *
       * @type: {*}
       * @private
       */
      this._inputDataAtom = performanceTestDict.inputDataAtom;

      /**
       * Name of the transformation function to be used to analyze the code's
       * performance
       *
       * @type: {string}
       * @private
       */
      this._transformationFunctionName =
        performanceTestDict.transformationFunctionName;

      /**
       * String describing the expected performance of the code (linear or not
       * linear for now)
       *
       * @type: {string}
       * @private
       */
      this._expectedPerformance = performanceTestDict.expectedPerformance;

      /**
       * Name of the function that is being evaluated in this test.
       *
       * @type: {string}
       * @private
       */
      this._evaluationFunctionName = performanceTestDict.evaluationFunctionName;
    };

    // Instance methods.
    /**
     * A getter for the _transformationFunctionName property.
     * Should return a string with the name of the function that will transform
     * the code being analyzed.
     *
     * @returns {string}
     */
    PerformanceTest.prototype.getTransformationFunctionName = function() {
      return this._transformationFunctionName;
    };

    /**
     * A getter for the _inputDataAtom property.
     * Should return an object that will be used as an input for this test.
     *
     * @returns {*}
     */
    PerformanceTest.prototype.getInputDataAtom = function() {
      return this._inputDataAtom;
    };

    /**
     * A getter for the _expectedPerformance property.
     * Should return a string that describes the expected performance for the
     * evaluated code.
     *
     * @returns {string}
     */
    PerformanceTest.prototype.getExpectedPerformance = function() {
      return this._expectedPerformance;
    };

    /**
     * A getter for the _evaluationFunctionName property.
     * Should return a string with the name of the function that is being
     * evaluated in this test.
     *
     * @returns {string}
     */
    PerformanceTest.prototype.getEvaluationFunctionName = function() {
      return this._evaluationFunctionName;
    };

    // Static class methods.
    /**
     * Returns a PerformanceTest object based on the dict passed in as a param.
     *
     * @param {dict} performanceTestDict Should have all of the properties
     *    needed to make the PerformanceTest.
     * @returns {PerformanceTest}
     */
    PerformanceTest.create = function(performanceTestDict) {
      return new PerformanceTest(performanceTestDict);
    };

    return PerformanceTest;
  }
]);
