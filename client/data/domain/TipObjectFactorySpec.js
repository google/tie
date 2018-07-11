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
 * @fileoverview Unit tests for Tip domain objects.
 */

 describe('TipObjectFactory', function() {
   var TipObjectFactory;
   var PrintTerminalService;

   beforeEach(module('tie'));
   beforeEach(inject(function($injector) {
     TipObjectFactory = $injector.get('TipObjectFactory');
     PrintTerminalService = $injector.get('PrintTerminalService');
   }));

   describe('getRequirePrintToBeDisabled', function() {
     it('should correctly retrieve whether print is disabled if it is enabled',
      function() {
        var tip = TipObjectFactory.create({
          requirePrintToBeDisabled: true,
          regexString: '\\bprint\\b',
          message: 'We noticed that you\'re using a print statement.'
        });

        expect(tip.getRequirePrintToBeDisabled()).toBe(true);
      });

     it('should correctly retrieve whether print is disabled if it\'s disabled',
      function() {
        var tip = TipObjectFactory.create({
          requirePrintToBeDisabled: false,
          regexString: 'import',
          message: 'For this question, you do not need to import libraries.'
        });

        expect(tip.getRequirePrintToBeDisabled()).toBe(false);
      });
   });

   describe('getRegexp', function() {
     it('should correctly retrieve the regexp of the tip', function() {
       var tip = TipObjectFactory.create({
         requirePrintToBeDisabled: true,
         regexString: '\\bprint\\b',
         message: 'We noticed that you\'re using a print statement.'
       });
       var printRegexp = new RegExp('\\bprint\\b');

       expect(tip.getRegexp()).toEqual(printRegexp);
     });
   });

   describe('getMessage', function() {
     it('should correctly retrieve the message of the tip', function() {
       var tip1 = TipObjectFactory.create({
         requirePrintToBeDisabled: true,
         regexString: '\\bprint\\b',
         message: 'We noticed that you\'re using a print statement.'
       });

       expect(tip1.getMessage()).toBe(
         'We noticed that you\'re using a print statement.');

       var tip2 = TipObjectFactory.create({
         requirePrintToBeDisabled: false,
         regexString: 'import',
         message: 'For this question, you do not need to import libraries.'
       });

       expect(tip2.getMessage()).toBe(
         'For this question, you do not need to import libraries.');
     });
   });

   describe('isActivatedBy', function() {
     it('should trigger a print tip if print is not supported', function() {
       var tip = TipObjectFactory.create({
         requirePrintToBeDisabled: true,
         regexString: '\\bprint\\b',
         message: 'We noticed that you\'re using a print statement.'
       });
       spyOn(
         PrintTerminalService, 'isPrintingSupported').and.returnValue(false);

       var code = [
         'def reverseWords(s):',
         '    print(s)',
         '    return s'
       ];
       expect(tip.isActivatedBy(code)).toBe(true);
     });

     it('should not triger a print tip if print is supported', function() {
       var tip = TipObjectFactory.create({
         requirePrintToBeDisabled: true,
         regexString: '\\bprint\\b',
         message: 'We noticed that you\'re using a print statement.'
       });
       spyOn(PrintTerminalService, 'isPrintingSupported').and.returnValue(true);

       var code = [
         'def reverseWords(s):',
         '    print(s)',
         '    return s'
       ];
       expect(tip.isActivatedBy(code)).toBe(false);
     });

     it('should trigger a regular tip regardless if print is supported',
      function() {
        var tip = TipObjectFactory.create({
          requirePrintToBeDisabled: false,
          regexString: 'import',
          message: 'For this question, you do not need to import libraries.'
        });
        var code = [
          'import',
          '',
          'def reverseWords(s):',
          '    return s'
        ];

        spyOn(
          PrintTerminalService, 'isPrintingSupported').and.returnValue(true);
        expect(tip.isActivatedBy(code)).toBe(true);

        PrintTerminalService.isPrintingSupported =
         jasmine.createSpy().and.returnValue(false);
        expect(tip.isActivatedBy(code)).toBe(true);
      });
   });
 });
