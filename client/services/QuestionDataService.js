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
 * @fileoverview Service for retrieving question data from static storage and
 * maintaining a copy in the frontend.
 */

tie.factory('QuestionDataService', [
  'QuestionObjectFactory', function(QuestionObjectFactory) {
    // TODO(sll): This should read from a JSON file.
    var _DATA_DICT = {
      "language": "python",
      "stages": [{
        "instructions": "Welcome to this programming exercise. Implement the abbreviate function.",
        "data": [{
          "input": "internationalization",
          "output": "i18n"
        }, {
          "input": "monkey",
          "output": "m4y"
        }, {
          "input": "friendship",
          "output": "f8p"
        }],
        "functionName": "abbreviate"
      }, {
        "instructions": "Make sure your code handles short strings correctly.",
        "data": [{
          "input": "cat",
          "output": "cat",
          "message": "Your function doesn't seem to work for 3-letter words."
        }, {
          "input": "at",
          "output": "at",
          "message": "Your function doesn't seem to work for 2-letter words."
        }, {
          "input": "a",
          "output": "a",
          "message": "Your function doesn't seem to work for 1-letter words."
        }, {
          "input": "",
          "output": "",
          "message": "Your function doesn't seem to work for the empty string."
        }],
        "functionName": "abbreviate"
      }]
    };

    var question = QuestionObjectFactory.create(_DATA_DICT);

    return {
      getData: function() {
        return question;
      }
    };
  }
]);
