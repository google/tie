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
 * @fileoverview Page object for the Questions page.
 */

var QuestionsPage = function() {
  var codeInput = element(by.css('.protractor-test-code-input'));
  var feedbackParagraphs = element.all(by.repeater(
    'paragraph in set.feedbackParagraphs'))
  var greetingParagraphs = element.all(by.repeater(
    'paragraph in greetingParagraphs track by $index'))
  var resetCodeBtn = element(by.css('.protractor-test-reset-code-btn'));
  var runCodeBtn = element(by.css('.protractor-test-run-code-btn'));

  this.get = function() {
    browser.get('/client/app.html');
  };

  this.resetCode = function() {
    resetCodeBtn.click();
  };

  this.runCode = function() {
    runCodeBtn.click();
  };

  this.submitCode = function(codeString) {
    browser.executeScript([
      "var editor = document.getElementsByClassName('CodeMirror')[0].CodeMirror;",
      "editor.setValue('" + codeString + "');"
    ].join(''));
    this.runCode();
  };

  this.countFeedbackParagraphs = function() {
    return feedbackParagraphs.count();
  };

  this.getFeedbackParagraphText = function(index) {
    return feedbackParagraphs.get(index).getText();
  };

  this.countGreetingParagraphs = function() {
    return greetingParagraphs.count();
  }

  this.getGreetingParagraphText = function(index) {
    return greetingParagraphs.get(index).getText();
  };
};

module.exports = QuestionsPage;
