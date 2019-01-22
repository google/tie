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
 * @fileoverview Utilities for Protractor E2E tests.
 */

/**
 * @type {string} Log type for browser console logs.
 */
const LOG_TYPE_BROWSER = 'browser';

/**
 * @type {number} Default timeout for testing alert dialogs presence.
 */
const ALERT_DIALOG_TIMEOUT_MILLISECONDS = 30 * 1000;


/**
 * Retrieves log entries currently present in the browser console.
 *
 * The minimal level of captured logs is configured in protractor.conf.js.
 *
 * Note: This should only be called once per spec as it will also clear the
 * browser console logs. Subsequent calls will return an empty list if no
 * logging has occurred since.
 *
 * @return {number}
 */
var getConsoleLogs = async function() {
  return browser.manage().logs().get(LOG_TYPE_BROWSER);
};

/**
 * Convenience function used in tests to expect no console output.
 */
var expectNoConsoleLogs = async function() {
  const consoleLogs = await getConsoleLogs();
  expect(consoleLogs.length).toBe(0);
};

/**
 * Convenience function used to check the number / content of console errors.
 *
 * @param {number} num The number of errors to expect.
 * @param {!Array} stringsToMatch A list of strings to check logs for.
 *    Should be passed in the order you'd like them checked.
 */
var expectConsoleErrors = async function(num, stringsToMatch) {
  const consoleLogs = await getConsoleLogs();
  for (var i = 0; i < consoleLogs.length; i++) {
    if (consoleLogs[i].level.name == 'SEVERE') {
      // Subtract one from the number of errors we're expecting,
      // as we've seen one.
      num--;
    }
    expect(consoleLogs[i].message.includes(stringsToMatch[i])).toBe(true);
  }
  // If we subtract one from num every time we see an error, this number should
  // be 0. If it's < 0, we saw more errors than expected. If it's > 0, we didn't
  // see enough errors.
  expect(num).toBe(0);
};

/**
 * Tests the presence and text of an expected alert dialog.
 *
 * @param {string} alertText the expected alert text.
 */
var expectAndAcceptAlert = async function(alertText) {
  await browser.wait(
      protractor.ExpectedConditions.alertIsPresent(),
      ALERT_DIALOG_TIMEOUT_MILLISECONDS);
  var alertDialog = await browser.switchTo().alert();
  expect(await alertDialog.getText()).toBe(alertText);
  await alertDialog.accept();
};

/**
 * Returns the current size of the browser window.
 *
 * @returns {!Object} An object that holds the dimensions of the window.
 */
var getWindowSize = async function() {
  return await browser.manage().window().getSize();
};

/**
 * Sets the dimensions of the browser window.
 *
 * @param {number} width The desired width of the window in pixels.
 * @param {number} height The desired width of the window in pixels.
 */
var setWindowSize = async function(width, height) {
  await browser.driver.manage().window().setSize(width, height);
};

/**
 * Sets the dimensions of the browser window to those of a large screen.
 */
var setLargeScreen = async function() {
  await setWindowSize(1070, 700);
};

/**
 * Sets the dimensions of the browser window to those of a small screen.
 */
var setSmallScreen = async function() {
  await setWindowSize(1050, 700);
};


module.exports = {
  expectNoConsoleLogs: expectNoConsoleLogs,
  expectConsoleErrors: expectConsoleErrors,
  expectAndAcceptAlert: expectAndAcceptAlert,
  getWindowSize: getWindowSize,
  setLargeScreen: setLargeScreen,
  setSmallScreen: setSmallScreen
};
