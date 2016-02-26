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
            $scope.quests = _.sortBy($scope.quests, function(o) { return o.QuestOrder; });
            $scope.$apply();
          })
          .catch(function (err) {
            Notification.error('Unable to list the quests.', err);
          });
      };

      $scope.down = function(index) {
        var originalOrder = parseInt($scope.quests[index].QuestOrder);
        var order = originalOrder - 1;
        QuestService.save(
          $scope.quests[index].ID,
          order,
          $scope.quests[index].Title,
          $scope.quests[index].Introduction,
          $scope.quests[index].IntroductionTranslation,
          $scope.quests[index].Completion,
          $scope.quests[index].CompletionTranslation,
          $scope.quests[index].StoryId)
          .then(function (response) {
            QuestService.save(
              $scope.quests[index - 1].ID,
              originalOrder,
              $scope.quests[index - 1].Title,
              $scope.quests[index - 1].Introduction,
              $scope.quests[index - 1].IntroductionTranslation,
              $scope.quests[index - 1].Completion,
              $scope.quests[index - 1].CompletionTranslation,
              $scope.quests[index - 1].StoryId)
              .then(function (response) {
                $scope.reload();
              })
              .catch(function (err) {
                console.error('Unable to change the order of the quest.', err);
                Notification.error('Unable to change the order of the quest.');
              });
          })
          .catch(function (err) {
            console.error('Unable to change the order of the quest.', err);
            Notification.error('Unable to change the order of the quest');
          });
      };

      $scope.up = function(index) {
        var originalOrder = parseInt($scope.quests[index].QuestOrder);
        var order = originalOrder + 1;
        QuestService.save(
          $scope.quests[index].ID,
          order,
          $scope.quests[index].Title,
          $scope.quests[index].Introduction,
          $scope.quests[index].IntroductionTranslation,
          $scope.quests[index].Completion,
          $scope.quests[index].CompletionTranslation,
          $scope.quests[index].StoryId)
          .then(function (response) {
            QuestService.save(
              $scope.quests[index + 1].ID,
              originalOrder,
              $scope.quests[index + 1].Title,
              $scope.quests[index + 1].Introduction,
              $scope.quests[index + 1].IntroductionTranslation,
              $scope.quests[index + 1].Completion,
              $scope.quests[index + 1].CompletionTranslation,
              $scope.quests[index + 1].StoryId)
              .then(function (response) {
                $scope.reload();
              })
              .catch(function (err) {
                console.error('Unable to change the order of the quest.', err);
                Notification.error('Unable to change the order of the quest.');
              });
          })
          .catch(function (err) {
            console.error('Unable to change the order of the quest.', err);
            Notification.error('Unable to change the order of the quest');
          });
      };

      $scope.edit = function (quest) {

        if(!$scope.selectedStory) {
          Notification.error("Please select a story first.");
          return;
        }

        var editInstance = $uibModal.open({
          animation: true,
          templateUrl: '../../../views/quest/editquest.html',
          controller: 'EditQuestCtrl',
          size: 'lg',
          resolve: {
            quest: function () {
              return quest;
            },
            questOrder: function () {
              return quest ? quest.QuestOrder :
                ($scope.quests.length > 0 ? $scope.quests.length: 0);
            },
            storyId: function () {
              return $scope.selectedStory;
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
