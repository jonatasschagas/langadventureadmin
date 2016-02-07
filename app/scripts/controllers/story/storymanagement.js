'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:StoryStorymanagementCtrl
 * @description
 * # StoryStorymanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('StoryStoryManagementCtrl',
  [
    '$scope',
    '$location',
    '$uibModal',
    'AuthenticationHolderService',
    'StoryService',
    'Notification',
    'lodash',
    function ($scope,
              $location,
              $uibModal,
              AuthenticationHolderService,
              StoryService,
              Notification,
              _) {

      if (!AuthenticationHolderService.userHasRole('writer') && !AuthenticationHolderService.userHasRole('admin')) {
        $location.path('/Unauthorized');
      }

      $scope.reload = function () {
        StoryService.list()
          .then(function (response) {
            $scope.stories = [];
            $scope.stories.push.apply($scope.stories, response.data.items);
            // forcing angular to re-draw the screen
            // this happens because the changes to the scope are
            // done outside the angular digest loop. The changes are
            // happening in the Lambda callbacks from AWS SDK
            $scope.$apply();
          })
          .catch(function (err) {
            Notification.error('Unable to list the stories.', err);
          });
      };

      $scope.reload();

      $scope.edit = function (story) {
        var editStoriesInstance = $uibModal.open({
          animation: true,
          templateUrl: '../../../views/story/editstory.html',
          controller: 'StoryEditStoryCtrl',
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

      $scope.delete = function (story) {
        console.log('Deleting story ID: ' + story.ID);
        StoryService.delete(story.ID)
          .then(function () {
            Notification.success('Story has been deleted successfully.');
            $scope.reload();
          })
          .catch(function (err) {
            Notification.error('Unable to delete Story.', err);
          });
      };

    }]);
