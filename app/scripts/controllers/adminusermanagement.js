'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AdminusermanagementCtrl
 * @description
 * # AdminusermanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AdminusermanagementCtrl',
  function ($scope, $location, $uibModal, Notification, AuthenticationHolderService, AdminUserService) {

    if (!AuthenticationHolderService.userHasRole('admin')) {
      $location.path('/Unauthorized');
    }

    $scope.reload = function () {
      AdminUserService.list(function (response) {
        if (response.success) {
          $scope.adminUsers = [];
          for (var idx in response.data.items) {
            var item = response.data.items[idx];
            $scope.adminUsers.push(item);
          }
          // forcing angular to re-draw the screen
          // this happens because the changes to the scope are
          // done outside the angular digest loop. The changes are
          // happening in the Lambda callbacks from AWS SDK
          $scope.$apply();
        } else {
          Notification.error('Unable to list the users.');
        }
      });
    };

    $scope.reload();

    $scope.editAdminUserRoles = function (adminUser) {
      var editAdminUserRolesInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/editadminuserroles.html',
        controller: 'EditadminuserrolesCtrl',
        size: 'lg',
        resolve: {
          adminUser: function () {
            return adminUser;
          }
        }
      });

      editAdminUserRolesInstance.result.then(function () {
        $scope.reload();
      }, function () {
        $scope.reload();
      });
    };

  });
