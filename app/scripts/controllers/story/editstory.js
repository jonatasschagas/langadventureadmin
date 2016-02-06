'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:StoryEditstoryCtrl
 * @description
 * # StoryEditstoryCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('StoryEditStoryCtrl', function ($scope, $uibModalInstance, Notification, StoryService, story) {

    $scope.story = story
    $scope.ID = story ? story.ID : null;

    $scope.languages = ['English', 'Spanish', 'Portuguese', 'French',
      'Finnish', 'Swedish', 'German', 'Russian', 'Japanese', 'Chinese'];

    $scope.save = function () {
      StoryService.save($scope.ID, $scope.title, $scope.targetLanguage, $scope.translatedLanguage)
        .then(function (response) {
          Notification.success(response.message);
          $uibModalInstance.close();
        })
        .catch(function (err){
          Notification.error(response.message);
        });
    };

  });
