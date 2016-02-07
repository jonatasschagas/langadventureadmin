'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AdminusermanagementCtrl
 * @description
 * # AdminusermanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AdminUserManagementCtrl',
  [
    '$scope',
    '$location',
    '$uibModal',
    'Notification',
    'AuthenticationHolderService',
    'AdminUserService',
    function (
      $scope,
      $location,
      $uibModal,
      Notification,
      AuthenticationHolderService,
      AdminUserService) {

    if (!AuthenticationHolderService.userHasRole('admin')) {
      $location.path('/Unauthorized');
    }

    $scope.reload = function () {
      AdminUserService.list().
        then(function (response) {
          $scope.adminUsers = [];
          $scope.adminUsers.push.apply($scope.adminUsers, response.data.items);
          // forcing angular to re-draw the screen
          // this happens because the changes to the scope are
          // done outside the angular digest loop. The changes are
          // happening in the Lambda callbacks from AWS SDK
          $scope.$apply();
        })
        .catch(function (err) {
          Notification.error('Unable to list the users.');
        });
    };

    $scope.reload();

    $scope.editAdminUserRoles = function (adminUser) {
      var editAdminUserRolesInstance = $uibModal.open({
        animation: true,
        templateUrl: '../../../views/adminUsers/editadminuserroles.html',
        controller: 'EditAdminUserRolesCtrl',
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

  }]);
