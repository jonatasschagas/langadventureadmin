'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditadminuserrolesCtrl
 * @description
 * # EditadminuserrolesCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditAdminUserRolesCtrl', function ($scope, $uibModalInstance, Notification, AdminUserService, adminUser) {

    $scope.availableRoles = ['admin', 'writer', 'player support', 'game designer'];
    $scope.adminUser = adminUser;

    $scope.save = function () {
      AdminUserService.updateRoles($scope.adminUser.ID, $scope.adminUser.UserRoles)
        .then(function (response) {
          Notification.success(response.message);
          $uibModalInstance.close();
        })
        .catch(function (err) {
          Notification.error('Unable to update roles.', err);
        });
    };

  });
