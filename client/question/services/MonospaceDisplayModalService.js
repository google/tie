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
 * @fileoverview Service for maintaining the state of the monospace display
 * modal.
 */

tie.factory('MonospaceDisplayModalService', [
  function() {
    // These are null if and only if the modal is hidden.
    var currentContentLines = null;
    var currentTitle = null;

    var onModalOpenCallbacks = [];

    return {
      /**
       * Retrieves the title to be displayed.
       */
      getTitle: function() {
        return currentTitle;
      },
      /**
       * Retrieves the content to be displayed.
       */
      getContentLines: function() {
        return currentContentLines;
      },
      /**
       * Returns whether the modal is displayed or not.
       */
      isDisplayed: function() {
        return (currentContentLines !== null);
      },
      /**
       * Adds a new observer callback, to be called when the modal is opened.
       *
       * @param {function} The callback to register.
       */
      registerCallback: function(newCallback) {
        onModalOpenCallbacks.push(newCallback);
      },
      /**
       * Displays the modal, using the given title and content.
       *
       * @param {string} newTitle The title of the modal.
       * @param {Array<string>} newContentLines An array with the lines of
       *   content to display.
       */
      showModal: function(newTitle, newContentLines) {
        currentTitle = newTitle;
        currentContentLines = newContentLines;
        onModalOpenCallbacks.forEach(function(onModalOpenCallback) {
          onModalOpenCallback();
        });
      },
      /**
       * Hides the modal.
       */
      hideModal: function() {
        currentContentLines = null;
        currentTitle = null;
      }
    };
  }
]);
