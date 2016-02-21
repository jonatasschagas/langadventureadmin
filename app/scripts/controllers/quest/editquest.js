'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditQuestCtrl
 * @description
 * # EditQuestCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditQuestCtrl',
  [
    '$scope',
    '$uibModalInstance',
    'Notification',
    'StoryService',
    'QuestService',
    'quest',
    function ($scope,
              $uibModalInstance,
              Notification,
              StoryService,
              QuestService,
              quest) {

      StoryService.list()
        .then(function (response) {
          $scope.stories = response.data.items;
          $scope.$apply();
        });

      if (quest != null) {
        $scope.quest = quest;
        $scope.questOrder = quest.QuestOrder;
        $scope.storyId = quest.StoryId;
        $scope.title = quest.Title;
        $scope.introduction = quest.Introduction;
        $scope.completion = quest.Completion;
        $scope.ID = quest ? quest.ID : null;
      }

      $scope.save = function () {
        QuestService.save(
          $scope.ID,
          $scope.questOrder,
          $scope.title,
          $scope.introduction,
          $scope.completion,
          $scope.storyId)
          .then(function (response) {
            Notification.success(response.message);
            $uibModalInstance.close();
          })
          .catch(function (err) {
            console.error('Error saving the quest record.', err);
            Notification.error('Error saving the quest record.');
          });
      };

    }]);

