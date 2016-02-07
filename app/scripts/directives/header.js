'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:header
 * @description
 * # header
 */
angular.module('frontendApp')
  .directive('header', function () {
    return {
      templateUrl: '/views/header.html',
      restrict: 'A',
      replace: true,
      controller:
        [
          '$scope',
          '$rootScope',
          '$location',
          '$route',
          'AuthenticationHolderService',
        function (
          $scope,
          $rootScope,
          $location,
          $route,
          AuthenticationHolderService) {

          $scope.$route = $route;

          $rootScope.$on('userLoggedIn', function () {
            $scope.user = AuthenticationHolderService.getUserInfo();
            $scope.isLoggedIn = $scope.user && $scope.user.fbUserId;
            $scope.$apply();
          });

          $scope.logout = function () {
            AuthenticationHolderService.logout();
            $scope.user = null;
            $scope.isLoggedIn = false;
            $location.path('/');
          };

        }]
    };
  });
