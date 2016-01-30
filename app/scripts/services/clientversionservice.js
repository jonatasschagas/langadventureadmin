'use strict';

/**
 * @ngdoc service
 * @name frontendApp.ClientVersionService
 * @description
 * # ClientVersionService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('ClientVersionService', function (LambdaService) {

    this.listClientVersions = function (callback) {

      LambdaService.callLambda(
        'langadventurebackend-nodejsbackend-client_version-list',
        {},
        function (response) {
          if (response.success) {
            callback({
              'success': true,
              'message': 'List of client versions listed successfully.',
              'data': response.data
            });
          } else {
            callback({
              'success': false,
              'message': 'Unable to fetch the list of client versions.'
            });
          }
        }
      )

    };

  });
