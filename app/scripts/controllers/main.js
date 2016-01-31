'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, Notification, AuthenticationHolderService) {

    var userInfo = AuthenticationHolderService.getUserInfo();
    $scope.userName = userInfo.userName;
    $scope.userRoles = userInfo.userRoles;

  });
