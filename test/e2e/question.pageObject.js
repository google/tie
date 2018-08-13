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
 * @fileoverview Page object for the Question page.
 */

/**
 * An object that represents the Question page.
 *
 * @constructor
 */
var QuestionPage = function() {
  var questionHelpers = browser.params.questionHelpers;
  const pageUrl = '/client/question.html';

  /**
   * DOM element where the code is input
   *
   * @type {DOMElement}
   */
  var codeInput = element(by.css('.protractor-test-code-input'));

  /**
   * Set of all of the feedback paragraphs rendered in the DOM.
   *
   * @type {Array}
   */
  var feedbackParagraphs =
      element.all(by.css('.protractor-test-feedback-paragraph'));

  /**
   * DOM element where the reset code button is.
   *
   * @type {DOMElement}
   */
  var resetCodeBtn = element(by.css('.protractor-test-reset-code-btn'));

  /**
   * DOM element where the run code button is.
   *
   * @type {DOMElement}
   */
  var runCodeBtn = element(by.css('.protractor-test-run-code-btn'));

  /**
   * Retrieves the TIE question page.
   *
   * @param {string} questionId ID of the question to open.
   *
   */
  this.get = async function(questionId) {
    var fullUrl = pageUrl + '?qid=' + questionId;
    await browser.get(fullUrl);
    await browser.waitForAngularEnabled();
    await questionHelpers.setupPage();
  };

  /**
   * Simulates clicking on the reset code button to initiate resetting the code.
   */
  this.resetCode = async function() {
    await resetCodeBtn.click();
  };

  /**
   * Simulates clicking on the run code button to initiate running the code.
   */
  this.runCode = async function() {
    await runCodeBtn.click();
  };

  /**
   * Simulates adding the given code string to the code editor.
   *
   * @param {string} codeString
   */
  this.submitCode = async function(codeString) {
    await browser.executeScript([
      'var editor = document.getElementsByClassName(\'CodeMirror\')[0].CodeMirror;',
      'editor.setValue(\'' + codeString + '\');'
    ].join(''));
    await this.runCode();
  };

  /**
   * Returns the number of feedback paragraphs rendered in the DOM.
   *
   * @returns {number}
   */
  this.countFeedbackParagraphs = async function() {
    return await feedbackParagraphs.count();
  };

  /**
   * Returns the content of the feedback paragraph at the given index in the
   * feedback paragraph array.
   *
   * @param {number} index
   * @returns {string}
   */
  this.getFeedbackParagraphText = async function(index) {
    return await feedbackParagraphs.get(index).getText();
  };
};

module.exports = QuestionPage;
