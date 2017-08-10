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
 * @fileoverview Service that provides a way to run different methods on the
 * server- and client-only versions of TIE.
 */
tie.factory('ServerHandlerService', ['SERVER_URL', function(SERVER_URL) {
  return {
    /**
     * Returns whether or not we're using the server version of TIE.
     *
     * @return {boolean} True if we should use the server, false otherwise.
     */
    doesServerExist: function() {
      return SERVER_URL !== null;
    }
  };
}]);
