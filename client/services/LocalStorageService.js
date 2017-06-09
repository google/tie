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

/*
 * A service that saves student code and feedback to the browser's localStorage.
 */
tie.factory('LocalStorageService', ['FeedbackParagraphObjectFactory',
  function(FeedbackParagraphObjectFactory) {
    // In some browsers, localStorage is not available and its
    // invocation throws an error.
    var localStorageIsAvailable = false;
    try {
      localStorageIsAvailable = Boolean(localStorage);
    } catch (e) {
      localStorageIsAvailable = false;
    }

    var getLocalStorageKeyForCode = function(questionId, language) {
      return questionId + ":" + language;
    };

    var getLocalStorageKeyForFeedback = function(questionId, language) {
      return questionId + ":feedback:" + language;
    }

    return {
      isAvailable: function() {
        return localStorageIsAvailable;
      },
      storeCode: function(questionId, code, language) {
        if (!localStorageIsAvailable) {
          return;
        }
        var localStorageKey = getLocalStorageKeyForCode(
          questionId, language);
        localStorage.setItem(localStorageKey, code);
      },
      loadStoredCode: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return null;
        }
        var localStorageKey = getLocalStorageKeyForCode(
          questionId, language);
        var storedCode = localStorage.getItem(localStorageKey);
        return storedCode;
      },
      clearLocalStorageCode: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return;
        }
        var localStorageKey = getLocalStorageKeyForCode(
          questionId, language);
        localStorage.removeItem(localStorageKey);
      },
      storeFeedback: function(questionId, feedbackStorage, language) {
        if (!localStorageIsAvailable) {
          return;
        }
        var localStorageKey = getLocalStorageKeyForFeedback(
          questionId, language);
        localStorage.setItem(localStorageKey, angular.toJson(feedbackStorage));
      },
      loadStoredFeedback: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return null;
        }
        var localStorageKey = getLocalStorageKeyForFeedback(
          questionId, language);
        var storedFeedback = localStorage.getItem(localStorageKey);
        if (storedFeedback == null) {
          return null;
        }
        try {
          var storedFeedbackStorage = [];
          var feedbackParagraphs = [];

          rawFeedback = JSON.parse(storedFeedback);
          for(var i = 0; i < rawFeedback.length; i++){
            for(var j = 0; j < rawFeedback[i].feedbackParagraphs.length; j++) {
              if(rawFeedback[i].feedbackParagraphs[j]._type === "text") {
                feedbackParagraphs.push(
                  FeedbackParagraphObjectFactory.createTextParagraph(
                    rawFeedback[i].feedbackParagraphs[j]._content));
              } else if (rawFeedback[i].feedbackParagraphs[j]._type === "code") {
                feedbackParagraphs.push(
                  FeedbackParagraphObjectFactory.createCodeParagraph(
                    rawFeedback[i].feedbackParagraphs[j]._content));
              } else if (rawFeedback[i].feedbackParagraphs[j]._type === "error") {
                feedbackParagraphs.push(
                  FeedbackParagraphObjectFactory.createSyntaxErrorParagraph(
                    rawFeedback[i].feedbackParagraphs[j]._content));
              }
            }
            storedFeedbackStorage.push({
              feedbackParagraphs: feedbackParagraphs
            });
            feedbackParagraphs = [];
          }
          return storedFeedbackStorage;
        } catch (e) {
          // console.log(e.message);
        }
      },
      clearLocalStorageFeedback: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return;
        }
        var localStorageKey = getLocalStorageKeyForFeedback(
          questionId, language);
        localStorage.removeItem(localStorageKey);
      },
    };
  }
]);

