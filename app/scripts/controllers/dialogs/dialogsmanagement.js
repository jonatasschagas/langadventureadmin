'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:StoryStorymanagementCtrl
 * @description
 * # StoryStorymanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DialogsManagementCtrl', [
    '$scope',
    '$location',
    '$uibModal',
    'AuthenticationHolderService',
    'StoryService',
    'DialogsService',
    'Notification',
    'lodash',
    function (
      $scope,
      $location,
      $uibModal,
      AuthenticationHolderService,
      StoryService,
      DialogsService,
      Notification,
      _) {

      if (!AuthenticationHolderService.userHasRole('writer') && !AuthenticationHolderService.userHasRole('admin')) {
        $location.path('/Unauthorized');
      }

      StoryService.list()
        .then(function (response) {
          $scope.stories = response.data.items;
          $scope.$apply();
        });

      $scope.reload = function () {
        DialogsService.list($scope.selectedStory)
          .then(function (response) {
            $scope.dialogs = [];
            $scope.dialogs.push.apply($scope.dialogs, response.data.items);
            // forcing angular to re-draw the screen
            // this happens because the changes to the scope are
            // done outside the angular digest loop. The changes are
            // happening in the Lambda callbacks from AWS SDK
            $scope.$apply();
          })
          .catch(function (err) {
            Notification.error('Unable to list the dialogs.', err);
          });
      };
      $scope.reload();

      $scope.delete = function (dialog) {
        console.log('Deleting dialog ID: ' + dialog.ID);
        DialogsService.delete(dialog.ID)
          .then(function () {
            Notification.success('Dialog has been deleted successfully.');
            $scope.reload();
          })
          .catch(function (err) {
            Notification.error('Unable to delete dialog.', err);
          });
      };

    }]);
