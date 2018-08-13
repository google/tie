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

var QuestionPage = browser.params.questionPage;

var utils = browser.params.utils;

describe('submitting questions', function() {
  var questionPage = new QuestionPage();
  var questionId = browser.params.defaultQuestionId;

  it('should successfully submit wrong code to a task', async function() {
    await questionPage.setUp();
    await questionPage.get(questionId);
    await questionPage.resetCode();
    await questionPage.runCode();

    expect(await questionPage.countFeedbackParagraphs()).toEqual(1);
  });

  afterEach(async function() {
    await utils.checkForConsoleErrors([]);
  });

  it('should successfully submit code', async function() {
    await questionPage.get(questionId);
    await questionPage.resetCode();

    var code = [
      'def reverseWords(s):',
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
      '    return letter', ''
    ].join('\\n');

    await questionPage.submitCode(code);
  });
});
