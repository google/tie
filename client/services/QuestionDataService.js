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
  "title": "Reverse Words",
  "starter_code": {
    "python": "def reverseWords(word):\n\treturn \"\""
  },
  "auxiliary_code": {
    "python": "def forgetLastWord(s):\n\tresult = \"\"\\n\treversed_word = []\n\tfor c in s:\n\t\tif c.isspace():\n\t\t\tresult += \"\".join(reversed(reversed_word))\n\t\t\tresult += c\n\t\t\treversed_word = []\n\t\telse:\n\t\t\treversed_word.append(c)\n\treturn result"
   },
  "prompts": [
    {
      "instructions": [
        "Welcome to this programming exercise.",
        "Your task is to implement the reverseWords function. This function takes a string of words separated by whitespace and reverses the non-whitespace characters in the words, but not their ordering, preserving the whitespace between them.",
        "For instance, 'moo cow bark dog' would become 'oom woc krab god'."
      ],
      "prerequisite_skills": ["Arrays", "Strings", "String Manipulation"],
      "acquired_skills": ["String Manipulation"],
      "input_function": null,
      "output_function": null,
      "main_function": "reverseWords",
      "correctness_tests": [
          {
            "input": "moo cow bark dog",
            "expected_output": "oom woc krab god"
          },
          {
            "input": "racecar civic kayak mom noon level",
            "expected_output": "racecar civic kayak mom noon level"
          }
      ],
      "buggy_output_tests": [
        {
          "buggy_function": "forgetLastWord",
          "messages": [
            "It looks like your output (%s) doesn't match our expected output (%s).",
            "Are you sure that you're reversing all the words?",
            "It looks like you're exiting the function without adding on the last reversed word."
          ]
        }
      ],
      "performance_tests": []
    },
    {
      "instructions": [
        "You need to make sure that your code handles short strings correctly, too."
      ],
      "prerequisite_skills": ["Arrays", "Strings", "String Manipulation"],
      "acquired_skills": ["String Manipulation"],
      "input_function": null,
      "output_function": null,
      "main_function": "reverseWords",
      "correctness_tests": [
          {
            "input": "I",
            "expected_output": "I"
          },
          {
            "input": "",
            "expected_output": ""
          },
          {
            "input": "A ",
            "expected_output": "A "
          },
          {
            "input": "ab",
            "expected_output": "ba"
          }
      ],
      "buggy_output_tests": [],
      "performance_tests": []
    },
    {
      "instructions": [
        "Good work! Now, make sure that your code accurately preserves whitespace and handles more than just letters."
      ],
      "prerequisite_skills": ["Arrays", "Strings", "String Manipulation"],
      "acquired_skills": ["String Manipulation", "Sets", "Arrays", "Maps"],
      "input_function": null,
      "output_function": null,
      "main_function": "reverseWords",
      "correctness_tests": [
          {
            "input": "   this  is \t a    whitespace  test",
            "expected_output": "   siht  si \t a    ecapsetihw  tset"
          },
          {
            "input": "\t  ",
            "expected_output": "\t  "
          },
          {
            "input": "123 456 789",
            "expected_output": "321 654 987"
          },
          {
            "input": "test for dashes-and others",
            "expected_output": "tset rof dna-sehsad srehto"
          }
      ],
      "buggy_output_tests": [],
      "performance_tests": [
        {
          "input_data_atom": "meow ",
          "transformation_function": "extendString",
          "expected_performance": "linear",
          "evaluation_function": "reverseWords"
        }
      ]
    }
  ],
  "style_tests": [
    {
      "evaluation_function": "system.AllowOnlyOneFunction",
      "expected_output": true,
      "message": "You should only be writing code in a reverseWords function. While decomposition is generally a good idea, you shouldn't need more than just this function for this exercise."
    }
  ]
};

    var question = QuestionObjectFactory.create(_DATA_DICT);

    return {
      getData: function() {
        return question;
      }
    };
  }
]);
