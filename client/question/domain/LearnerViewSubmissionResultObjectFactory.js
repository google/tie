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
 * LearnerViewSubmissionResult domain objects.
 */

 tie.factory('LearnerViewSubmissionResultObjectFactory', [
   function() {
     /** LearnerViewSubmissionResult stores the feedback and stdout for a
      * given code submission. This information is later displayed in
      * the feedback window and print terminal after a learner chooses to
      * submit their code.
      */

     /**
      * Constructor for LearnerViewSubmissionResult
      *
      * @param {Feedback} feedback The feedback generated after running the
      * user code
      * @param {string} stdout Output from user code
      */
     var LearnerViewSubmissionResult = function(feedback, stdout) {
       /**
        * @type {Feedback}
        * @private
        */
       this._feedback = feedback;

       /**
        * @type {string}
        * @private
        */
       this._stdout = stdout;
     };

     // Instance methods.
     /**
      * A getter for the _feedback property.
      * It should return a Feedback object with the correct feedback for
      * the submission of the user code.
      *
      * @returns {Feedback}
      */
     LearnerViewSubmissionResult.prototype.getFeedback = function() {
       return this._feedback;
     };

     /**
      * A getter for the _stdout property.
      * It should return a string with the print output of the code submission.
      * The stdout displayed is the output associated with the first failed
      * test. If all tests for the past and current tasks passed, then the
      * output of the last test case of the current task is shown.
      *
      * @returns {string}
      */
     LearnerViewSubmissionResult.prototype.getStdout = function() {
       return this._stdout;
     };

     // Static class methods.
     /**
      * This method creates and returns a LearnerViewSubmissionResult object
      * from the params specified.
      *
      * @param {Feedback} feedback The feedback generated after running the
      * user code
      * @param {string} stdout Output from user code
      * @returns {LearnerViewSubmissionResult}
      */
     LearnerViewSubmissionResult.create = function(
       feedback, stdout) {
       return new LearnerViewSubmissionResult(feedback, stdout);
     };

     return LearnerViewSubmissionResult;
   }
 ]);
