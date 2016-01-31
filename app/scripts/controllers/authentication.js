'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AuthenticationCtrl
 * @description
 * # AuthenticationCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AuthenticationCtrl', function ($scope, $location, AuthenticationService, Notification) {

    $scope.login = function () {
      AuthenticationService.login(function (response) {
        if (response.success) {
          Notification.success(response.message);
          // redirecting to the main page
          $location.path('/');
        } else {
          Notification.error({message: response.message, delay: 10000});
        }
      });
    };
  });
