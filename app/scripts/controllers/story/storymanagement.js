'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:StoryStorymanagementCtrl
 * @description
 * # StoryStorymanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('StoryStorymanagementCtrl',
  function ($scope, $location, $uibModal, AuthenticationHolderService, StoryService, Notification) {

    if (!AuthenticationHolderService.userHasRole('writer') && !AuthenticationHolderService.userHasRole('admin')) {
      $location.path('/Unauthorized');
    }

    $scope.reload = function () {
      StoryService.list(function (response) {
        if (response.success) {
          $scope.stories = [];
          for (var idx in response.data.items) {
            var item = response.data.items[idx];
            $scope.stories.push(item);
          }
          // forcing angular to re-draw the screen
          // this happens because the changes to the scope are
          // done outside the angular digest loop. The changes are
          // happening in the Lambda callbacks from AWS SDK
          $scope.$apply();
        } else {
          Notification.error('Unable to list the stories.');
        }
      });
    };

    $scope.reload();

    $scope.editStories = function (story) {
      var editStoriesInstance = $uibModal.open({
        animation: true,
        templateUrl: '../../../views/story/editstory.html',
        controller: 'StoryEditstoryCtrl',
        size: 'lg',
        resolve: {
          story: function () {
            return story;
          }
        }
      });

      editStoriesInstance.result.then(function () {
        $scope.reload();
      }, function () {
        $scope.reload();
      });
    };

    $scope.delete = function(story) {
      StoryService.delete(story.ID, function(response) {
        if(response.success) {
          Notification.error('Story has been deleted successfully.');
          $scope.reload();
        } else {
          Notification.error('Unable to delete Story.');
        }
      });
    };

  });
