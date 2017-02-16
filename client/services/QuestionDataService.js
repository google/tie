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
      "title": "Internationalization (i18n)",
      "prompts": [{
        "instructions": [
          "Welcome to this programming exercise.",
          "You will complete this exercise by editing the code in the sample.py file using your favorite editor. Every time you save the file, I will evaluate your code and let you know about next steps.",
          "Your first task is to implement the abbreviate function. It takes a string as input and returns an abbreviation of the string of the form <first character><length of the middle of the string><last character>. For example, \"internationalization\" should be abbreviated as \"i18n\"."
        ],
        "prerequisite_skills": ["Arrays", "Strings", "String Manipulation"],
        "acquired_skills": ["String Manipulation"],
        "input_function": null,
        "output_function": null,
        "main_function": "sample.abbreviate",
        "correctness_tests": [{
          "input": "internationalization",
          "output": "i18n"
        }, {
          "input": "monkey",
          "output": "m4y"
        }, {
          "input": "friendship",
          "output": "f8p"
        }],
        "buggy_output_tests": [{
          "buggy_function": "forgetLastLetter",
          "messages": [
            "It looks like your output (%s) doesn't match our expected output (%s).",
            "You seem to be dropping the last character of the string when you're abbreviating.",
            "Make sure to add the last character of the string back on when you've abbreviated."
          ]
        }],
        "performance_tests": [{}]
      }],
      "style_tests": [{
        "style_evaluation_function": "system.AllowOnlyOneFunction",
        "output": true,
        "message": "You should only be writing code in an abbreviate function. While decomposition is generally a good idea, you shouldn't need more than just this function for this exercise."
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
