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
    'QuestService',
    'quest',
    'questOrder',
    'storyId',
    function ($scope,
              $uibModalInstance,
              Notification,
              QuestService,
              quest,
              questOrder,
              storyId) {

      $scope.questOrder = questOrder;
      $scope.storyId = storyId;

      if (quest != null) {
        $scope.quest = quest;
        $scope.title = quest.Title;
        $scope.introduction = quest.Introduction;
        $scope.introductionTranslation = quest.IntroductionTranslation;
        $scope.completion = quest.Completion;
        $scope.completionTranslation = quest.CompletionTranslation;
        $scope.ID = quest ? quest.ID : null;
      }

      $scope.save = function (isValid) {

        if(!isValid) {
          return;
        }

        QuestService.save(
          $scope.ID,
          $scope.questOrder,
          $scope.title,
          $scope.introduction,
          $scope.introductionTranslation,
          $scope.completion,
          $scope.completionTranslation,
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

      $scope.checkErrors = function(formItem) {
        return formItem.$invalid && !formItem.$pristine
      };

    }]);

