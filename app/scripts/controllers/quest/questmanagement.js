'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:QuestManagementCtrl
 * @description
 * # QuestManagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('QuestManagementCtrl', [
    '$scope',
    '$location',
    '$uibModal',
    'AuthenticationHolderService',
    'StoryService',
    'QuestService',
    'Notification',
    'lodash',
    function (
      $scope,
      $location,
      $uibModal,
      AuthenticationHolderService,
      StoryService,
      QuestService,
      Notification,
      _) {

      if (!AuthenticationHolderService.userHasRole('writer')
        && !AuthenticationHolderService.userHasRole('admin')) {
        $location.path('/Unauthorized');
      }

      StoryService.list()
        .then(function (response) {
          $scope.stories = response.data.items;
          $scope.$apply();
        });

      $scope.reload = function () {
        if(!$scope.selectedStory) {
          return;
        }
        QuestService.list($scope.selectedStory)
          .then(function (response) {
            $scope.quests = [];
            $scope.quests.push.apply($scope.quests, response.data.items);
            $scope.$apply();
          })
          .catch(function (err) {
            Notification.error('Unable to list the quests.', err);
          });
      };

      $scope.edit = function (quest) {
        var editInstance = $uibModal.open({
          animation: true,
          templateUrl: '../../../views/quest/editquest.html',
          controller: 'EditQuestCtrl',
          size: 'lg',
          resolve: {
            quest: function () {
              return quest;
            }
          }
        });

        editInstance.result.then(function () {
          $scope.reload();
        }, function () {
          $scope.reload();
        });
      };

      $scope.delete = function (quest) {
        console.log('Deleting quest ID: ' + quest.ID);
        QuestService.delete(quest.ID)
          .then(function () {
            Notification.success('Quest has been deleted successfully.');
            $scope.reload();
          })
          .catch(function (err) {
            Notification.error('Unable to delete quest.', err);
          });
      };

    }]);
