'use strict';

/**
 * @ngdoc service
 * @name frontendApp.AdminUserService
 * @description
 * # AdminUserService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('AdminUserService',
  [
    'LambdaService',
    function (LambdaService) {

      this.list = function () {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-admin_user-list:development',
          {}
        );
      };

      this.updateRoles = function (fbUserId, roles, callback) {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-admin_user-update_roles:development',
          {
            'fbUserId': fbUserId,
            'roles': roles
          }
        );
      };

    }]);
