'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AdminusermanagementCtrl
 * @description
 * # AdminusermanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AdminusermanagementCtrl', function ($scope, Notification, AdminUserService) {

    AdminUserService.list(function (response) {
      if (response.success) {
        $scope.adminUsers = response.data.items;
      } else {
        Notification.error('Unable to list the users.');
      }
    });

  });
