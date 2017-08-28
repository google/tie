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
 * @fileoverview Adds an importable configuration file for TIE.
 */

window.tieConfig = angular.module('tieConfig', []);

tieConfig.config(['$httpProvider', function($httpProvider) {
  // Set default headers for POST and PUT requests.
  $httpProvider.defaults.headers.post = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  $httpProvider.defaults.headers.put = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  // Convert requests to JSON strings.
  $httpProvider.interceptors.push([
    '$httpParamSerializerJQLike', function($httpParamSerializerJQLike) {
      return {
        request: function(config) {
          if (config.data) {
            config.data = $httpParamSerializerJQLike({
              payload: JSON.stringify(config.data)
            });
          }
          return config;
        }
      };
    }
  ]);
}]);

/**
 * Setting app to html5mode so that we don't have to have #'s in the url.
 */
tieConfig.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);
