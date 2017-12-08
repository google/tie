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
 * @fileoverview Unit tests for the MonospaceDisplayModalService.
 */

describe('MonospaceDisplayModalServiceSpec', function() {
  var MonospaceDisplayModalService;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    MonospaceDisplayModalService = $injector.get(
      'MonospaceDisplayModalService');
  }));

  describe('hidden and shown states', function() {
    it('should correctly hide the modal', function() {
      MonospaceDisplayModalService.hideModal();
      expect(MonospaceDisplayModalService.getTitle()).toBe(null);
      expect(MonospaceDisplayModalService.getContentLines()).toBe(null);
      expect(MonospaceDisplayModalService.isDisplayed()).toBe(false);
    });

    it('should correctly show the modal', function() {
      MonospaceDisplayModalService.showModal('new title', ['content 1']);
      expect(MonospaceDisplayModalService.getTitle()).toBe('new title');
      expect(MonospaceDisplayModalService.getContentLines())
        .toEqual(['content 1']);
      expect(MonospaceDisplayModalService.isDisplayed()).toBe(true);
    });

    it('should correctly replace the modal contents', function() {
      MonospaceDisplayModalService.showModal('new title', ['content 1']);
      MonospaceDisplayModalService.showModal('newer title', ['content 2']);
      expect(MonospaceDisplayModalService.getTitle()).toBe('newer title');
      expect(MonospaceDisplayModalService.getContentLines())
        .toEqual(['content 2']);
      expect(MonospaceDisplayModalService.isDisplayed()).toBe(true);
    });
  });

  describe('on-load callbacks', function() {
    it('should correctly register a callback', function() {
      var testData = {
        sampleCallback: function() {
          return 0;
        }
      };
      spyOn(testData, 'sampleCallback');

      MonospaceDisplayModalService.registerCallback(testData.sampleCallback);
      MonospaceDisplayModalService.showModal('title', ['content']);
      expect(testData.sampleCallback).toHaveBeenCalled();
    });
  });
});
