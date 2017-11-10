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
 * @fileoverview Unit tests for the EventHandlerService.
 */
describe('EventHandlerService', function() {
  var $httpBackend;
  var EventHandlerService;
  var ServerHandlerService;
  var sessionId;
  var questionId;
  var questionVersion;
  var taskId;

  var FEEDBACK_CATEGORIES;

  var HTTP_STATUS_CODE_OK = 200;
  var HTTP_STATUS_CODE_SERVER_ERROR = 500;

  beforeEach(module('tie', function($provide) {
    $provide.constant('SERVER_URL', 'http://katamari.com');
  }));
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    EventHandlerService = $injector.get('EventHandlerService');
    ServerHandlerService = $injector.get('ServerHandlerService');
    sessionId = '1000';
    questionId = 'katamari';
    questionVersion = 'katamari forever';
    taskId = 'create a katamari 1m big!';
  }));

  describe('createSessionPauseEvent', function() {

    it('creates a SessionPauseEvent + sends the event batch to the backend',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/send_event_batch').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        spyOn(EventHandlerService, 'sendCurrentEventBatch').and.callThrough();
        EventHandlerService.createSessionPauseEvent(sessionId);
        $httpBackend.flush();
      });
  });


  describe('createSessionResumeEvent', function() {

    it('creates a SessionResumeEvent and adds it to the current EventBatch',
      function() {
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createSessionResumeEvent(sessionId);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
      });
  });


  describe('createQuestionStartEvent', function() {

    it('creates a QuestionStartEvent and adds it to the current EventBatch',
      function() {
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createQuestionStartEvent(
          sessionId, questionId, questionVersion);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
      });
  });

  describe('createQuestionCompleteEvent', function() {

    it('creates a QuestionCompleteEvent + sends the event batch to the backend',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/send_event_batch').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        spyOn(EventHandlerService, 'sendCurrentEventBatch').and.callThrough();
        EventHandlerService.createQuestionCompleteEvent(
          sessionId, questionId, questionVersion);
        $httpBackend.flush();
      });
  });


  describe('createTaskStartEvent', function() {

    it('creates a TaskStartEvent and adds it to the current EventBatch',
      function() {
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createTaskStartEvent(
          sessionId, questionId, questionVersion, taskId);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
      });
  });


  describe('createTaskCompleteEvent', function() {

    it('creates a TaskCompleteEvent and adds it to the current EventBatch',
      function() {
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createTaskCompleteEvent(
          sessionId, questionId, questionVersion, taskId);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
      });
  });

  describe('createCodeResetEvent', function() {

    it('creates a CodeResetEvent and adds it to the current EventBatch',
      function() {
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createCodeResetEvent(sessionId);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
      });
  });


  describe('createCodeSubmitEvent', function() {

    it('creates a CodeSubmitEvent and adds it to the current EventBatch',
      function() {
        var code = [
          'def myFunction(arg):',
          '    result = arg.rstrip()',
          '    return result',
          ''
        ].join('\n');
        var feedbackText = 'Here is some feedback!';
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createCodeSubmitEvent(
          sessionId, feedbackText, FEEDBACK_CATEGORIES.SYNTAX_ERROR, code);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
      });
  });


  describe('sendCurrentEventBatch', function() {

    it('sends an EventBatch to the backend and clears the batch.',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/send_event_batch').respond(
          HTTP_STATUS_CODE_OK, {});
        EventHandlerService.createTaskCompleteEvent(
          sessionId, questionId, questionVersion, taskId);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.sendCurrentEventBatch();
        $httpBackend.flush();
        expect(EventHandlerService.currentEventBatch.length).toEqual(0);
      });

    it('holds onto the current EventBatch if there is a backend error.',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/send_event_batch').respond(
          HTTP_STATUS_CODE_SERVER_ERROR, {});
        EventHandlerService.createTaskCompleteEvent(
          sessionId, questionId, questionVersion, taskId);
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.sendCurrentEventBatch();
        $httpBackend.flush();
        expect(EventHandlerService.currentEventBatch.length).toEqual(1);
      });
  });
});
