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
 * @fileoverview A service that saves student code, feedback, and progress
 *    to the browser's localStorage.
 */

tie.factory('LocalStorageService', ['FeedbackParagraphObjectFactory',
  'ReinforcementBulletObjectFactory',
  function(FeedbackParagraphObjectFactory, ReinforcementBulletObjectFactory) {
    // In some browsers, localStorage is not available and its
    // invocation throws an error.
    var localStorageIsAvailable = false;
    try {
      localStorageIsAvailable = Boolean(localStorage);
    } catch (e) {
      localStorageIsAvailable = false;
    }

    /**
     * Returns the local storage key for a given question.
     *
     * @param {string} questionId
     * @param {string} language
     * @returns {string}
     */
    var getLocalStorageKeyForCode = function(questionId, language) {
      return questionId + ":" + language + ":code";
    };

    /**
     * Returns the local storage key for the feedback.
     *
     * @param {string} questionId
     * @param {string} language
     * @returns {string}
     */
    var getLocalStorageKeyForFeedback = function(questionId, language) {
      return questionId + ":" + language + ":feedback";
    };

    return {
      /**
       * Checks if the local storage is available.
       *
       * @returns {boolean}
       */
      isAvailable: function() {
        return localStorageIsAvailable;
      },

      /**
       * Stores the code into local storage - so long as local storage is
       * available.
       *
       * @param {string} questionId
       * @param {string} code
       * @param {string} language
       */
      storeCode: function(questionId, code, language) {
        if (!localStorageIsAvailable) {
          return;
        }

        /**
         * TODO(talee): If we start updating the question, then we need to add a
         * a way to track which version the question is on, and to check if the
         * code that was saved was for a previous version, and if so, to let
         * the user know the question has changed.
         */
        var codeWithVersion = "1:" + code;

        var localStorageKey = getLocalStorageKeyForCode(
          questionId, language);
        localStorage.setItem(localStorageKey, codeWithVersion);
      },

      /**
       * Loads the code from local storage if local storage is available.
       * If local storage is not available, then it returns null.
       *
       * @param {string} questionId
       * @param {string} language
       * @returns {string|null}
       */
      loadStoredCode: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return null;
        }

        var localStorageKey = getLocalStorageKeyForCode(
          questionId, language);
        var storedCodeWithVersion = localStorage.getItem(localStorageKey);

        if (storedCodeWithVersion === null) {
          return null;
        }
        // TODO(talee): Check version when we start having different ones.
        var storedCode = storedCodeWithVersion.substring(
          storedCodeWithVersion.indexOf(':') + 1);

        return storedCode;
      },

      /**
       * Clears the local storage such that there is no longer any code
       * stored there.
       *
       * @param {string} questionId
       * @param {string} language
       */
      clearLocalStorageCode: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return;
        }

        var localStorageKey = getLocalStorageKeyForCode(
          questionId, language);
        localStorage.removeItem(localStorageKey);
      },

      /**
       * Takes the paragraphs and reinforcement bullets and creates an object
       * that is then converted to json and stored.

       * @param {string} questionId
       * @param {Array} feedback
       * @param {Array} reinforcement
       * @param {string} language
       */
      storeFeedback: function(questionId, feedback, reinforcement, language) {
        if (!localStorageIsAvailable) {
          return;
        }

        var localStorageKey = getLocalStorageKeyForFeedback(
          questionId, language);
        var feedbackWithReinforcement = {};
        feedbackWithReinforcement.feedbackParagraphs = feedback;
        feedbackWithReinforcement.reinforcementBullets = reinforcement;

        localStorage.setItem(localStorageKey,
          angular.toJson(feedbackWithReinforcement));
      },

      /**
       * Loads the feedback and parses it into JSON, and then reconstructs
       * the feedback paragraphs & reinforcement bullets fron the JSON object
       *
       * @param {string} questionId
       * @param {string} language
       * @returns {Object}
       */
      loadStoredFeedback: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return null;
        }

        var localStorageKey = getLocalStorageKeyForFeedback(
          questionId, language);
        var storedFeedback = localStorage.getItem(localStorageKey);
        if (storedFeedback === null) {
          return null;
        }
        var rawFeedback = angular.fromJson(storedFeedback);

        var reconstructedFeedback = [];
        reconstructedFeedback = rawFeedback.feedbackParagraphs.map(
          function(paragraph) {
            return FeedbackParagraphObjectFactory.fromDict(paragraph);
          }
        );
        var reconstructedReinforcement = [];
        if (rawFeedback.reinforcementBullets) {
          reconstructedReinforcement = rawFeedback.reinforcementBullets.map(
            function(bullets) {
              return ReinforcementBulletObjectFactory.fromDict(bullets);
            }
          );
        }

        return {
          feedbackParagraphs: reconstructedFeedback,
          reinforcementBullets: reconstructedReinforcement
        };
      },

      clearLocalStorageFeedback: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return;
        }
        var localStorageKey = getLocalStorageKeyForFeedback(
          questionId, language);
        localStorage.removeItem(localStorageKey);
      }
    };
  }
]);

