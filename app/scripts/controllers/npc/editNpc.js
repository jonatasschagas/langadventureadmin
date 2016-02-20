'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditNPCCtrl
 * @description
 * # EditNPCCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditNPCCtrl',
  [
    '$scope',
    '$uibModalInstance',
    'Notification',
    'StoryService',
    'story',
    function ($scope,
              $uibModalInstance,
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

      $scope.languages = ['English', 'Spanish', 'Portuguese', 'French',
        'Finnish', 'Swedish', 'German', 'Russian', 'Japanese', 'Chinese'];

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

