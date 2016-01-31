'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditadminuserrolesCtrl
 * @description
 * # EditadminuserrolesCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditadminuserrolesCtrl', function ($scope, $uibModalInstance, Notification, AdminUserService, adminUser) {

    $scope.availableRoles = ['admin', 'writer', 'player support', 'game designer'];
    $scope.adminUser = adminUser;

    $scope.save = function () {
      AdminUserService.updateRoles($scope.adminUser.ID, $scope.adminUser.UserRoles, function (response) {
        if (response.success) {
          Notification.success(response.message);
          $uibModalInstance.close();
        } else {
          Notification.error(response.message);
        }
      });
    };

  });
