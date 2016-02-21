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
        return LambdaService.callLambda('admin_user-list', {});
      };

      this.updateRoles = function (fbUserId, roles) {
        return LambdaService.callLambda('admin_user-update_roles',
          {
            'fbUserId': fbUserId,
            'roles': roles
          }
        );
      };

    }]);
