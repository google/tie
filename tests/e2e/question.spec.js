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
 * @fileoverview Protractor E2E tests for the Question page.
 */

var QuestionPage = browser.params.questionPage;

var testUtils = browser.params.utils;


describe('Question Page', function() {
  var questionPage = new QuestionPage();
  var questionId = browser.params.defaultQuestionId;

  beforeAll(async function() {
    await testUtils.expectNoConsoleLogs();
    await questionPage.get(questionId);
    await questionPage.resetCode();
  });

  afterEach(async function() {
    // There should be no console output after each test.
    await testUtils.expectNoConsoleLogs();
  });

  it('should successfully submit code', async function() {
    await questionPage.resetCode();
    await questionPage.runCode();
  });

  it('should display a feedback text paragraph after a run', async function() {
    await questionPage.resetCode();
    await questionPage.runCode();

    expect(await questionPage.countFeedbackParagraphs()).toBe(1);
  });

  it('should allow switching theme with the theme selector', async function() {
    // Themes: 0=light, 1=dark.
    await questionPage.applyTheme(1);
    expect(await questionPage.hasDarkTheme()).toBe(true);
  });

  it('should display all expected links', async function() {
    // Python Primer link.
    expect(await questionPage.isPythonPrimerLinkDisplayed()).toBe(true);
    // Privacy link.
    expect(await questionPage.isPrivacyLinkDisplayed()).toBe(true);
    // About link.
    expect(await questionPage.isAboutLinkDisplayed()).toBe(true);
  });

  it('should display question and coding UIs in 2 columns on large screens',
     async function() {
       await testUtils.setLargeScreen();

       let questionUiLocation = await questionPage.getQuestionUiLocation();
       let questionUiSize = await questionPage.getQuestionUiSize();
       let codingUiLocation = await questionPage.getCodingUiLocation();

       // Coding and Question UIs should be horizontally aligned.
       expect(codingUiLocation.y).toEqual(questionUiLocation.y);

       // Coding UI should be to the right of Question UI.
       expect(codingUiLocation.x)
           .toBeGreaterThan(questionUiLocation.x + questionUiSize.width);
     });

  it('should display question and coding UIs in 2 rows on small screens',
     async function() {
       await testUtils.setSmallScreen();

       let questionUiLocation = await questionPage.getQuestionUiLocation();
       let questionUiSize = await questionPage.getQuestionUiSize();
       let codingUiLocation = await questionPage.getCodingUiLocation();

       // Coding and Question UI should be vertically aligned.
       expect(codingUiLocation.x).toEqual(questionUiLocation.x);

       // Question UI should be above Coding UI.
       expect(codingUiLocation.y)
           .toBeGreaterThan(questionUiLocation.y + questionUiSize.height);
     });

  it('should fit the question and coding UIs in page width on large screens',
     async function() {
       await testUtils.setLargeScreen();

       let windowSize = await testUtils.getWindowSize();

       let codingUiLocation = await questionPage.getCodingUiLocation();
       let codingUiSize = await questionPage.getCodingUiSize();

       // The right edge of the coding UI should be less than the window width.
       expect(codingUiLocation.x + codingUiSize.width)
           .toBeLessThan(windowSize.width);
     });

  it('should fit the question and coding UIs in page width on small screens',
     async function() {
       await testUtils.setSmallScreen();

       let windowSize = await testUtils.getWindowSize();

       let codingUiLocation = await questionPage.getCodingUiLocation();
       let codingUiSize = await questionPage.getCodingUiSize();

       let questionUiLocation = await questionPage.getQuestionUiLocation();
       let questionUiSize = await questionPage.getQuestionUiSize();

       // The right edge of the question UI should be less than the window
       // width.
       expect(questionUiLocation.x + questionUiSize.width)
           .toBeLessThan(windowSize.width);

       // The right edge of the coding UI should be less than the window width.
       expect(codingUiLocation.x + codingUiSize.width)
           .toBeLessThan(windowSize.width);
     });
});
