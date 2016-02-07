'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AuthenticationCtrl
 * @description
 * # AuthenticationCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AuthenticationCtrl',
  [
    '$scope',
    '$location',
    'AuthenticationService',
    'Notification',
    function (
      $scope,
      $location,
      AuthenticationService,
      Notification) {

    $scope.authenticating = false;
    $scope.login = function () {
      $scope.authenticating = true;
      AuthenticationService.login()
        .then(function (response) {
          $scope.authenticating = false;
          Notification.success(response);
          // redirecting to the main page
          $location.path('/');
        })
        .catch(function (err) {
          $scope.authenticating = false;
          console.log('Unable to login.', err);
          Notification.error('Unable to Login. Server internal error. Please try again.');
        });
    };
  }]);
