/**
 * @fileoverview Adds an importable configuration file for TIE.
 */


window.tieBasic = angular.module('tieBasic', []);

tieBasic.config(['$httpProvider', function($httpProvider) {
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
