'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, Notification, AuthenticationService, AdminUserService) {

    var userInfo = AuthenticationService.getUserInfo();
    $scope.userName = userInfo.userName;
    AdminUserService.getRoles(userInfo.fbUserId, function(response) {
      $scope.userRoles = response.data.userRoles;
    });

  });
