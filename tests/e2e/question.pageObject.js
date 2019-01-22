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
 * @fileoverview Question page object for Protractor E2E tests.
 */

const DARK_THEME_WRAPPER_CLASS = 'night-mode';

/**
 * An object that represents the Question page.
 * Provides convenience methods to interact with the page.
 *
 * @constructor
 */
var QuestionPage = function() {
  var questionTestConfig = browser.params.questionTestConfig;
  const pageUrl = '/client/question.html';

  /**
   * TIE wrapper element.
   *
   * @type {webdriver.WebElement}
   */
  var tieWrapperElement = element(by.css('.protractor-test-tie-wrapper'));

  /**
   * Question UI element.
   *
   * @type {webdriver.WebElement}
   */
  var questionUiElement = element(by.css('.protractor-test-question-ui'));

  /**
   * Coding UI element.
   *
   * @type {webdriver.WebElement}
   */
  var codingUiElement = element(by.css('.protractor-test-coding-ui'));

  /**
   * Reset Code button.
   *
   * @type {webdriver.WebElement}
   */
  var resetCodeButton = element(by.css('.protractor-test-reset-code-button'));

  /**
   * Run Code button.
   *
   * @type {webdriver.WebElement}
   */
  var runCodeButton = element(by.css('.protractor-test-run-code-button'));

  /**
   * Set of all of the feedback text paragraphs rendered in the DOM.
   *
   * @type {Array.<webdriver.WebElement>}
   */
  var feedbackParagraphs =
      element.all(by.css('.protractor-test-feedback-paragraph'));

  /**
   * Theme selector.
   *
   * @type {webdriver.WebElement}
   */
  var themeSelector = element(by.css('.protractor-test-theme-select'));

  /**
   * Python primer link.
   *
   * @type {webdriver.WebElement}
   */
  var pythonPrimerLink = element(by.css('.protractor-test-python-primer-link'));

  /**
   * TIE About link.
   *
   * @type {webdriver.WebElement}
   */
  var aboutLink = element(by.css('.protractor-test-about-link'));

  /**
   * TIE Privacy link.
   *
   * @type {webdriver.WebElement}
   */
  var privacyLink = element(by.css('.protractor-test-privacy-link'));

  /**
   * Retrieves the TIE question page.
   *
   * @param {string} questionId ID of the question to load.
   *
   */
  this.get = async function(questionId) {
    var fullUrl = pageUrl + '?qid=' + questionId;
    await browser.waitForAngularEnabled();
    await browser.get(fullUrl);
  };

  /**
   * Simulates clicking on the reset code button.
   */
  this.resetCode = async function() {
    await resetCodeButton.click();
  };

  /**
   * Simulates writing the given code string in the code editor.
   *
   * @param {string} codeString
   */
  this.setCode = async function(codeString) {
    await browser.executeScript([
      'var editor = ',
      'document.getElementsByClassName(\'CodeMirror\')[0].CodeMirror;',
      'editor.setValue(`' + codeString + '`);'
    ].join(''));
  };

  /**
   * Simulates clicking on the Run Code button.
   */
  this.runCode = async function() {
    await browser.wait(ExpectedConditions.elementToBeClickable(runCodeButton));
    await runCodeButton.click();
    await browser.wait(ExpectedConditions.elementToBeClickable(runCodeButton));
  };

  /**
   * Returns the number of feedback text paragraphs rendered in the DOM.
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

  /**
   * Simulates selecting the theme which list index is the passed index.
   *
   * @param {number} themeIndex index of the theme to be applied.
   */
  this.applyTheme = async function(themeIndex) {
    await themeSelector.all(by.tagName('option')).get(themeIndex).click();
  };

  /**
   * Returns true if the dark theme is applied to TIE's wrapper element.
   *
   * @returns {boolean}
   */
  this.hasDarkTheme = async function() {
    let wrapperClasses = await tieWrapperElement.getAttribute('class');
    return await wrapperClasses.match(DARK_THEME_WRAPPER_CLASS) !== null;
  };

  /**
   * Returns true if the Python primer link is displayed on the page.
   *
   * @returns {boolean}
   */
  this.isPythonPrimerLinkDisplayed = async function() {
    return await pythonPrimerLink.isDisplayed();
  };

  /**
   * Returns true if the About link is displayed on the page.
   *
   * @returns {boolean}
   */
  this.isAboutLinkDisplayed = async function() {
    return await aboutLink.isDisplayed();
  };

  /**
   * Returns true if the Privacy link is displayed on the page.
   *
   * @returns {boolean}
   */
  this.isPrivacyLinkDisplayed = async function() {
    return await privacyLink.isDisplayed();
  };

  /**
   * Returns the question UI element location.
   *
   */
  this.getQuestionUiLocation = async function() {
    return await questionUiElement.getLocation();
  };

  /**
   * Returns the question UI element size.
   *
   */
  this.getQuestionUiSize = async function() {
    return await questionUiElement.getSize();
  };

  /**
   * Returns the coding UI element location.
   *
   */
  this.getCodingUiLocation = async function() {
    return await codingUiElement.getLocation();
  };

  /**
   * Returns the coding UI element size.
   *
   */
  this.getCodingUiSize = async function() {
    return await codingUiElement.getSize();
  };
};

module.exports = QuestionPage;
