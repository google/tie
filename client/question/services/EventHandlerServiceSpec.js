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

  beforeEach(module('tie', function($provide) {
    $provide.constant('SERVER_URL', 'http://katamari.com');
  }));
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    FEEDBACK_CATEGORIES = $injector.get(
      'FEEDBACK_CATEGORIES');
    EventHandlerService = $injector.get(
      'EventHandlerService');
    ServerHandlerService = $injector.get(
      'ServerHandlerService');
    sessionId = '1000';
    questionId = 'katamari';
    questionVersion = 'katamari forever';
    taskId = 'create a katamari 1m big!';
  }));

  describe('createSessionPauseEvent', function() {

    it('sends a POST request to the backend to create a SessionPauseEvent',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/create_session_pause_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createSessionPauseEvent(sessionId);
        $httpBackend.flush();
      });
  });


  describe('createSessionResumeEvent', function() {

    it('sends a POST request to the backend to create a SessionResumeEvent',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/create_session_resume_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createSessionResumeEvent(sessionId);
        $httpBackend.flush();
      });
  });


  describe('createQuestionStartEvent', function() {

    it('sends a POST request to the backend to create a QuestionStartEvent',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/create_question_start_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createQuestionStartEvent(
          sessionId, questionId, questionVersion);
        $httpBackend.flush();
      });
  });

  describe('createQuestionCompleteEvent', function() {

    it('sends a POST request to the backend to create a QuestionCompleteEvent',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/create_question_complete_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createQuestionCompleteEvent(
          sessionId, questionId, questionVersion);
        $httpBackend.flush();
      });
  });


  describe('createTaskStartEvent', function() {

    it('sends a POST request to the backend to create a TaskStartEvent',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/create_task_start_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createTaskStartEvent(
          sessionId, questionId, questionVersion, taskId);
        $httpBackend.flush();
      });
  });


  describe('createTaskCompleteEvent', function() {

    it('sends a POST request to the backend to create a TaskCompleteEvent',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/create_task_complete_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createTaskCompleteEvent(
          sessionId, questionId, questionVersion, taskId);
        $httpBackend.flush();
      });
  });

  describe('createCodeResetEvent', function() {

    it('sends a POST request to the backend to create a CodeResetEvent',
      function() {
        $httpBackend.expectPOST(
          '/ajax/event/create_code_reset_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createSessionPauseEvent(sessionId);
        $httpBackend.flush();
      });
  });


  describe('createCodeSubmitEvent', function() {

    it('sends a POST request to the backend to create a CodeSubmitEvent',
      function() {
        var code = [
          'def myFunction(arg):',
          '    result = arg.rstrip()',
          '    return result',
          ''
        ].join('\n');
        var feedbackText = 'Here is some feedback!';
        $httpBackend.expectPOST(
          '/ajax/event/create_code_submit_event').respond(
          HTTP_STATUS_CODE_OK, {});
        spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
        EventHandlerService.createCodeSubmitEvent(
          sessionId, feedbackText, FEEDBACK_CATEGORIES[0],
          code, false);
        $httpBackend.flush();
      });
  });
});
