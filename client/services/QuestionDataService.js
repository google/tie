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
      "starter_code": {
        "python": "def abbreviate(word):\n\treturn \"\"\n\ndef are_all_unique(words):\n\treturn True"
      },
      "auxiliary_code": {
        "python": "def forgetLastLetter(word):\n\tresult = \"%s%d\" % (word[0], len(word) - 2) if len(word) > 2 else word\n\treturn result\n\ndef useFirstAndLastLetterAndLengthToAbbreviate(word):\n\tif word:\n\t\treturn \"%s%d%s\" % (word[0], len(word) - 2, word[len(word) - 1])\n\treturn \"\"\n\ndef CreateListOfUniqueStrings(atom, size):\n\tresult = []\n\tfor i in range(size):\n\t\tresult.append(atom * (i + 1))\n\treturn result"
      },
      "prompts": [{
        "instructions": [
          "Welcome to this programming exercise.",
          "Your first task is to implement the abbreviate function. It takes a string as input and returns an abbreviation of the string of the form <first character><length of the middle of the string><last character>. For example, \"internationalization\" should be abbreviated as \"i18n\"."
        ],
        "prerequisite_skills": ["Arrays", "Strings", "String Manipulation"],
        "acquired_skills": ["String Manipulation"],
        "input_function": null,
        "output_function": null,
        "main_function": "abbreviate",
        "correctness_tests": [{
          "input": "internationalization",
          "expected_output": "i18n"
        }, {
          "input": "monkey",
          "expected_output": "m4y"
        }, {
          "input": "friendship",
          "expected_output": "f8p"
        }],
        "buggy_output_tests": [{
          "buggy_function": "forgetLastLetter",
          "messages": [
            "It looks like your output (%s) doesn't match our expected output (%s).",
            "You seem to be dropping the last character of the string when you're abbreviating.",
            "Make sure to add the last character of the string back on when you've abbreviated."
          ]
        }],
        "performance_tests": [{}],
      }, {
        "instructions": [
          "Now, modify your code so that it does not abbreviate short strings when it's not necessary."
        ],
        "prerequisite_skills": ["Arrays", "Strings", "String Manipulation"],
        "acquired_skills": ["String Manipulation"],
        "input_function": null,
        "output_function": null,
        "main_function": "abbreviate",
        "correctness_tests": [{
          "input": "internationalization",
          "expected_output": "i18n"
        }, {
          "input": "cat",
          "expected_output": "cat"
        }, {
          "input": "at",
          "expected_output": "at"
        }, {
          "input": "a",
          "expected_output": "a"
        }, {
          "input": "",
          "expected_output": ""
        }],
        "buggy_output_tests": [{
          "buggy_function": "useFirstAndLastLetterAndLengthToAbbreviate",
          "messages": [
            "It looks like your output (%s) doesn't match our expected output (%s).",
            "It looks like you're using the string's length minus two in the middle, which is usually fine, but can you think of any issues that might present?",
            "For short strings, you're actually ending up with a negative number in the middle. You don't need to abbreviate strings with length <= 3."
          ]
        }],
        "performance_tests": [{
          "input_data_atom": "m",
          "transformation_function": "system.ExtendString",
          "expected_performance": "constant",
          "evaluation_function": "abbreviate"
        }]
      }],
      "style_tests": [{
        "evaluation_function": "system.AllowOnlyOneFunction",
        "expected_output": true,
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
