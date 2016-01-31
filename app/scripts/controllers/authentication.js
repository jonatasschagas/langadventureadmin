'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AuthenticationCtrl
 * @description
 * # AuthenticationCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AuthenticationCtrl', function ($scope, $location, AuthenticationService, AdminUserService, Notification) {

    $scope.login = function () {
      AuthenticationService.login(function (response) {
        if (response.success) {
          Notification.success(response.message);
          var userInfo = AuthenticationService.getUserInfo();
          // registering access from the user to the database
          AdminUserService.register(userInfo.fbUserId, userInfo.userName, function (response) {
            if (response.success) {
              $location.path('/');
            } else {
              Notification.error({message: response.message, delay: 10000});
            }
          });
          // redirecting to the main page

        } else {
          Notification.error({message: response.message, delay: 10000});
        }
      });
    };

  });
