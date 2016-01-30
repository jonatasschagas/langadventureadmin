'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function (Notification, ClientVersionService) {

    ClientVersionService.listClientVersions(function (response) {
      if (response.success) {
        Notification.success(response.data.Items[0].alias);
      } else {
        Notification.error(response.message);
      }
    });

  });
