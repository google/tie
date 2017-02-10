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
 * @fileoverview Factory for creating new frontend instances of Event domain
 * objects.
 */

tie.factory('EventObjectFactory', [
  function() {
    var EVENT_TYPE_CODE_SUBMITTED = 'codeSubmitted';
    var EVENT_TYPE_FEEDBACK_GIVEN = 'feedbackGiven';
    var ALLOWED_EVENT_TYPES = [
      EVENT_TYPE_CODE_SUBMITTED, EVENT_TYPE_FEEDBACK_GIVEN];

    var Event = function(type, value, timestamp) {
      if (ALLOWED_EVENT_TYPES.indexOf(type) === -1) {
        throw Error('Invalid event type: ' + type);
      }
      this._type = type;
      this._value = value;
      this._timestamp = timestamp;
    };

    // Instance methods
    Event.prototype.getType = function() {
      return this._type;
    };

    Event.prototype.getValue = function() {
      return this._value;
    };

    Event.prototype.getTimestamp = function() {
      return this._timestamp;
    };

    // Static class methods.
    Event.createCodeSubmittedEvent = function(code) {
      return new Event(EVENT_TYPE_CODE_SUBMITTED, code, new Date());
    };

    Event.createFeedbackGivenEvent = function(feedback) {
      return new Event(EVENT_TYPE_FEEDBACK_GIVEN, feedback, new Date());
    };

    return Event;
  }
]);
