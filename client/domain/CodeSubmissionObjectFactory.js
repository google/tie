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
 * CodeSubmission domain objects.
 */

tie.factory('CodeSubmissionObjectFactory', [
  function() {
    var CodeSubmission = function(rawCode) {
      this._rawCode = rawCode.trim();
      this._preprocessedCodeLines = rawCode.trim().split('\n');
      // An array that contains an entry for each line of the preprocessed code
      // that stores which line of the raw code it is mapped to. Preprocessed
      // lines that do not map to raw code lines have the corresponding entry
      // being null. Note that all entries here are zero-indexed, so a
      // transformation is needed in order to map them to human-readable
      // 1-indexed line numbers.
      this._rawCodeLineIndexes = [];
      for (var i = 0; i < this._preprocessedCodeLines.length; i++) {
        this._rawCodeLineIndexes.push(i);
      }
    };

    CodeSubmission.prototype.IMPORT_PATTERN = new RegExp('^\\ {4}import\\ \\w+$');
    CodeSubmission.prototype.TAB_LENGTH = 4;

    // Instance methods.
    CodeSubmission.prototype.getRawCode = function() {
      return this._rawCode;
    };

    CodeSubmission.prototype.getPreprocessedCode = function() {
      return this._preprocessedCodeLines.join('\n');
    };

    CodeSubmission.prototype.getRawCodeLineIndexes = function() {
      return this._rawCodeLineIndexes;
    };

    // Replaces the entire code. The line numbers should not change.
    CodeSubmission.prototype.replace = function(replacementCode) {
      var replacementCodeLines = replacementCode.split('\n');
      if (replacementCodeLines.length !== this._preprocessedCodeLines.length) {
        throw Error('Incorrect number of lines of code provided.');
      }
      this._preprocessedCodeLines = replacementCodeLines;
    };

    CodeSubmission.prototype.append = function(codeToAppend) {
      var codeToAppendLines = codeToAppend.split('\n');
      this._preprocessedCodeLines = this._preprocessedCodeLines.concat(
        codeToAppendLines);
      for (var i = 0; i < codeToAppendLines.length; i++) {
        this._rawCodeLineIndexes.push(null);
      }
    };

    CodeSubmission.prototype.prepend = function(codeToPrepend) {
      var codeToPrependLines = codeToPrepend.split('\n');
      this._preprocessedCodeLines = codeToPrependLines.concat(
        this._preprocessedCodeLines);
      for (var i = 0; i < codeToPrependLines.length; i++) {
        this._rawCodeLineIndexes.unshift(null);
      }
    };

    // Move all global imports in student code out of StudentCode
    // class
    CodeSubmission.prototype.removeImportsFromStudentCode = function() {
      var insertPos = 0;
      for (var i = 0; i < this._preprocessedCodeLines.length; i++) {
        if (this.IMPORT_PATTERN.test(this._preprocessedCodeLines[i])) {
          var importLine = this._preprocessedCodeLines[i].slice(
              this.TAB_LENGTH);
          this._preprocessedCodeLines.splice(i, 1);
          this._preprocessedCodeLines.splice(insertPos, 0, importLine);
          this._rawCodeLineIndexes.splice(i, 1);
          this._rawCodeLineIndexes.splice(insertPos, 0, importLine);
          insertPos++;
        }
      }
    };

    // Static class methods.
    CodeSubmission.create = function(rawCode) {
      return new CodeSubmission(rawCode);
    };

    return CodeSubmission;
  }
]);
