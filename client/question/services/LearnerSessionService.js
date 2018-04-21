// Copyright 2018 The TIE Authors. All Rights Reserved.
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
 * @fileoverview A service that stores data related to the learner's current
 *   session history.
 */

tie.factory('LearnerSessionService', [
  'LearnerSessionDataObjectFactory', 'ArchivedSubmissionObjectFactory',
  function(LearnerSessionDataObjectFactory, ArchivedSubmissionObjectFactory) {
    var learnerSessionData = LearnerSessionDataObjectFactory.createNew();

    return {
      /**
       * Clears all data in this service.
       */
      clear: function() {
        learnerSessionData = LearnerSessionDataObjectFactory.createNew();
      },

      /**
       * Initializes the learner session data from its versioned JSON
       * representation.
       *
       * @param {string} jsonData
       */
      initFromJson: function(jsonData) {
        learnerSessionData = LearnerSessionDataObjectFactory.fromJson(jsonData);
      },

      /**
       * Adds a new archived submission.
       *
       * @param {string} rawCode The code for the given submission.
       * @param {Array<FeedbackParagraph>} feedbackParagraphs The list of
       *  feedback paragraphs received by the learner.
       */
      addNewArchivedSubmission: function(rawCode, feedbackParagraphs) {
        var archivedSubmission = ArchivedSubmissionObjectFactory.create(
          rawCode, feedbackParagraphs);
        learnerSessionData.addNewArchivedSubmission(archivedSubmission);
      }
    };
  }
]);
