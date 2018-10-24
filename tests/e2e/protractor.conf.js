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
 * @fileoverview Configuration values for TIE Protractor E2E tests.
 */

exports.config = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome',
    loggingPrefs: {
      browser: 'ALL',
    },
  },
  specs: ['./*.spec.js'],
  onPrepare: async function() {
    // By default, Protractor use data:text/html,<html></html> as resetUrl, but
    // location.replace from the data: to the file: protocol is not allowed
    // (we'll get ‘not allowed local resource’ error), so we replace resetUrl
    // with the file: protocol (this will display system's root folder).
    browser.resetUrl = 'file://' + __dirname.replace('/tests/e2e', '');
    browser.baseUrl = 'file://' + __dirname.replace('/tests/e2e', '');
  },
  jasmineNodeOpts: {
    // Maxmium time to run an "it" block
    // https://www.protractortest.org/#/timeouts#timeouts-from-jasmine
    defaultTimeoutInterval: 60 * 1000,
  },
  allScriptsTimeout: 60 * 1000,
  SELENIUM_PROMISE_MANAGER: false,
  params: {
    defaultQuestionId: 'reverseWords',
    questionPage: require('./question.pageObject.js'),
    utils: require('./utils.js')
  }
};
