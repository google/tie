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
 * @fileoverview Factory for creating new frontend instances of FeedbackDetails
 * domain objects.
 */

tie.factory('FeedbackDetailsObjectFactory', [
  'FEEDBACK_CATEGORIES', function(FEEDBACK_CATEGORIES) {
    /**
     * Feedback objects encapsulate the personalized feedback that is used to
     * provide constructive feedback to the user.
     */

    /**
     * Constructor for FeedbackDetails
     *
     * @param {string} feedbackCategory The category of the feedback. Must be
     *    a valid entry in FEEDBACK_CATEGORIES.
     * @constructor
     */
    var FeedbackDetails = function(feedbackCategory) {
      if (!FEEDBACK_CATEGORIES.hasOwnProperty(feedbackCategory)) {
        throw Error('Invalid feedback category: ' + feedbackCategory);
      }

      /**
       * Records the category corresponding to this feedback.
       *
       * @type {string}
       * @private
       */
      this._feedbackCategory = feedbackCategory;
    };

    // Instance methods.
    /**
     * A getter for the _feedbackCategory property.
     * This function should return the category which corresponds to this
     * feedback.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getFeedbackCategory = function() {
      return this._feedbackCategory;
    };

    // Static class methods.
    FeedbackDetails.createTimeLimitErrorFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);
    };

    FeedbackDetails.createStackExceededFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
    };

    FeedbackDetails.createServerErrorFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.SERVER_ERROR);
    };

    FeedbackDetails.createRuntimeErrorFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.RUNTIME_ERROR);
    };

    FeedbackDetails.createSyntaxErrorFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.SYNTAX_ERROR);
    };

    return FeedbackDetails;
  }
]);
