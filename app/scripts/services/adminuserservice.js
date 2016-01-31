'use strict';

/**
 * @ngdoc service
 * @name frontendApp.AdminUserService
 * @description
 * # AdminUserService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('AdminUserService', function (LambdaService) {

    this.getRoles = function (fbUserId, callback) {
      LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-admin_user-get_roles:development',
        {'fbUserId': fbUserId},
        function (response) {
          callback(response);
        }
      )
    };

    this.list = function (callback) {
      LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-admin_user-list:development',
        {},
        function (response) {
          callback(response);
        }
      )
    };

  });
