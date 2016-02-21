'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:StoryEditstoryCtrl
 * @description
 * # StoryEditstoryCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('StoryEditStoryCtrl',
  [
    '$scope',
    '$uibModalInstance',
    'CONFIG',
    'Notification',
    'StoryService',
    'story',
    function ($scope,
              $uibModalInstance,
              CONFIG,
              Notification,
              StoryService,
              story) {

      if (story != null) {
        $scope.story = story;
        $scope.title = story.Title;
        $scope.targetLanguage = story.TargetLanguage;
        $scope.translatedLanguage = story.TranslatedLanguage;
        $scope.ID = story ? story.ID : null;
      }

      $scope.languages = CONFIG.languages;

      $scope.save = function () {
        StoryService.save($scope.ID, $scope.title, $scope.targetLanguage, $scope.translatedLanguage)
          .then(function (response) {
            Notification.success(response.message);
            $uibModalInstance.close();
          })
          .catch(function (err) {
            console.error('Error saving the story record.', err);
            Notification.error('Error saving the story record.');
          });
      };

    }]);

