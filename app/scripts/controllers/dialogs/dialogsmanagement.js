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
    'QuestService',
    'DialogsService',
    'Notification',
    'lodash',
    function (
      $scope,
      $location,
      $uibModal,
      AuthenticationHolderService,
      QuestService,
      DialogsService,
      Notification,
      _) {

      if (!AuthenticationHolderService.userHasRole('writer') && !AuthenticationHolderService.userHasRole('admin')) {
        $location.path('/Unauthorized');
      }

      QuestService.list()
        .then(function (response) {
          $scope.quests = response.data.items;
          $scope.$apply();
        });

      $scope.reload = function () {

        if(!$scope.selectedQuest) {
          return;
        }

        DialogsService.list($scope.selectedQuest)
          .then(function (response) {
            $scope.dialogs = [];
            $scope.dialogs.push.apply($scope.dialogs, response.data.items);
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
