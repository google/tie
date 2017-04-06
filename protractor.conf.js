// Protractor configuration for TIE.

exports.config = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome'
  },
  specs: ['testing/page-loading-spec.js'],
  baseUrl: 'file://' + __dirname,
  onPrepare: function() {
    // By default, Protractor use data:text/html,<html></html> as resetUrl, but 
    // location.replace from the data: to the file: protocol is not allowed
    // (we'll get ‘not allowed local resource’ error), so we replace resetUrl with one
    // with the file: protocol (this particular one will open system's root folder)
    browser.resetUrl = 'file://';
  }
};