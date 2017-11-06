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
 * @fileoverview End-to-end tests for loading all pages.
 */

var QuestionsPage = require('./questions.pageObject.js');
var utils = require('./utils.js');

describe('submitting questions', function() {
  var CORRECTNESS_FEEDBACK_TEXT;

  beforeEach(inject(function($injector) {
    CORRECTNESS_FEEDBACK_TEXT = $injector.get('CORRECTNESS_FEEDBACK_TEXT');
  }));


  it('should successfully submit wrong code to a task', function() {
    var questionsPage = new QuestionsPage();

    questionsPage.get();
    questionsPage.resetCode();
    questionsPage.runCode();

    expect(questionsPage.countFeedbackParagraphs()).toEqual(2);

/*
    var expectedFeedbackTextResult = 'valid feeback text';
    var actualFeedbackTextResult = 'invalid feeback text';
    var actualFeedbackText = questionsPage.getFeedbackParagraphText(0);
    for (var typeKey in CORRECTNESS_FEEDBACK_TEXT) {
      if (CORRECTNESS_FEEDBACK_TEXT[typeKey].includes(
        actualFeedbackText)) {
        actualFeedbackTextResult = expectedFeedbackTextResult;
        break;
      }
    }
    expect(actualFeedbackTextResult).toEqual(expectedFeedbackTextResult);
*/
/*
    expect(questionsPage.getFeedbackParagraphText(0)).toMatch(
      'Your code produced the following result*');
*/
  });

  afterEach(function() {
    utils.checkForConsoleErrors([]);
  });

  it('should successfully display reinforcement input', function() {
    var questionsPage = new QuestionsPage();

    questionsPage.get();
    questionsPage.resetCode();

    var code = [
      'def findMostCommonCharacter(s):',
      '    counter = 0',
      '    maxCount = -1',
      '    letter = s[0]',
      '    for i in range(len(s)):',
      '        if counter == 0:',
      '            counter = 1',
      '        elif s[i-1] == s[i]:',
      '            counter += 1',
      '        else:',
      '            counter = 0',
      '        if counter > maxCount:',
      '            maxCount = counter',
      '            letter = s[i]',
      '    return letter',
      ''
    ].join('\\n');

    questionsPage.submitCode(code);

    expect(questionsPage.countReinforcementBullets()).toEqual(6);
    expect(questionsPage.getReinforcementBulletText(5)).toEqual(
      'Fails on \'"a    b c    d e f f"\'');
  });
});
