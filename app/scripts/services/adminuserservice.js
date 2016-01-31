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

    this.register = function (fbUserId, userName, callback) {
      LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-admin_user-register:development',
        {'fbUserId': fbUserId, 'userName': userName},
        function (response) {
          if (response.success) {
            callback({
              'success': true,
              'message': 'Admin user ' + userName + ' has been registered successfully.'
            });
          } else {
            callback({
              'success': false,
              'message': 'Unable to register user ' + userName + '.'
            });
          }
        }
      )
    };

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
