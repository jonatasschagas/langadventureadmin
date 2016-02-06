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
      AuthenticationService.login()
        .then(function (response) {
          Notification.success(response);
          // redirecting to the main page
          $location.path('/');
        })
        .catch(function (err) {
          console.log('Unable to login.', err);
          Notification.error('Unable to Login. Server internal error. Please try again.');
        });
    };
  });
