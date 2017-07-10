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
 * @fileoverview A service that saves the feedback paragraphs to the browser's
 *    localStorage.
 */

tie.factory('FeedbackStorageService', [
  'FeedbackParagraphObjectFactory',
  function(FeedbackParagraphObjectFactory) {
    // In some browsers, localStorage is not available and its invocation throws
    // an error.
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
    var getLocalStorageKey = function(questionId, language) {
      return questionId + "-feedback:" + language;
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
       * Stores the feedback into local storage - so long as local storage is
       * available.
       *
       * @param {string} questionId
       * @param {[{feedbackParagraphs: FeedbackParagraph}]} cachedFeedback
       * @param {string} language
       */
      storeFeedback: function(questionId, cachedFeedback, language) {
        if (!localStorageIsAvailable) {
          return;
        }

        var localStorageKey = getLocalStorageKey(questionId, language);
        var feedbackParagraphs = [];
        for (var i = 0; i < cachedFeedback.length; i++) {
          feedbackParagraphs.push(cachedFeedback[i].feedbackParagraphs);
        }
        localStorage.setItem(
          localStorageKey, JSON.stringify(feedbackParagraphs));
      },

      /**
       * Loads feedback state from local storage if local storage is available.
       * If local storage is not available, then it returns null.
       *
       * @param {string} questionId
       * @param {string} language
       * @returns {[FeedbackParagraph]|null)
       */
      loadStoredFeedback: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return null;
        }

        var localStorageKey = getLocalStorageKey(questionId, language);
        var storedFeedback = localStorage.getItem(localStorageKey);
        if (storedFeedback) {
          var unparsedParagraphs = JSON.parse(storedFeedback);
          var parsedParagraphs = [];
          for (var i = 0; i < unparsedParagraphs.length; i++) {
            var paragraphSet = [];
            for (var j = 0; j < unparsedParagraphs[i].length; j++) {
              var paragraph;
              if (unparsedParagraphs[i][j]._type === 'error') {
                paragraph =
                    FeedbackParagraphObjectFactory.createSyntaxErrorParagraph(
                        unparsedParagraphs[i][j]._content);
              } else if (unparsedParagraphs[i][j]._type === 'code') {
                paragraph = FeedbackParagraphObjectFactory.createCodeParagraph(
                    unparsedParagraphs[i][j]._content);
              } else {
                paragraph = FeedbackParagraphObjectFactory.createTextParagraph(
                    unparsedParagraphs[i][j]._content);
              }
              paragraphSet.push(paragraph);
            }
            parsedParagraphs.push(paragraphSet);
          }
          return parsedParagraphs;
        } else {
          return null;
        }
      },

      /**
       * Clears the local storage such that there is no longer any feedback
       * stored there.
       *
       * @param {string} questionId
       * @param {string} language
       */
      clearLocalStorageFeedback: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return;
        }

        var localStorageKey = getLocalStorageKey(questionId, language);
        localStorage.removeItem(localStorageKey);
      }
    };
  }
]);
