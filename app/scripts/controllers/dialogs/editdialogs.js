'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditDialogsCtrl
 * @description
 * # EditDialogsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditDialogsCtrl',
  ['$scope',
    '$location',
    '$routeParams',
    'lodash',
    'Notification',
    'StoryService',
    'DialogsService',
    function ($scope, $location, $routeParams, _, Notification, StoryService, DialogsService) {

      $scope.templateUrl = "showNodesContentsTemplate.html";

      $scope.dialogId = $routeParams.dialogId;
      if (!_.isEmpty($scope.dialogId)) {
        DialogsService.get($scope.dialogId)
          .then(function (response) {
            $scope.title = response.data.Item.Title;
            $scope.storyId = response.data.Item.StoryId;
            $scope.whoStarts = response.data.Item.WhoStarts;
            $scope.data = response.data.Item.Nodes;
            $scope.id = response.data.Item.ID;
            console.log('Dialog has been loaded.');
            $scope.$apply();
          });
      }

      $scope.stories = [];
      StoryService.list().then(function (response) {
        $scope.stories = response.data.items;
        $scope.$apply();
      });

      $scope.data = [{
        title: 'This is the first node...',
        translation: 'This is the first translation...',
        nodes: []
      }];

      $scope.currentText = $scope.data[0].title;
      $scope.currentTranslation = $scope.data[0].translation;
      $scope.currentNode = $scope.data[0];

      $scope.remove = function (scope) {
        scope.remove();
      };

      $scope.toggle = function (scope) {
        scope.toggle();
      };

      $scope.selectNode = function (node) {
        $scope.currentText = node.title;
        $scope.currentTranslation = node.translation;
        $scope.currentNode = node;
      };

      $scope.changeNode = function () {
        if ($scope.currentNode) {
          $scope.currentNode.title = $scope.currentText;
          $scope.currentNode.translation = $scope.currentTranslation;
        }
      };

      $scope.cutSize = function (title) {
        if (title && title.length > 50) {
          return title.substring(0, 50) + '...';
        } else {
          return title;
        }
      };

      $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
      };

      $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        var newIdx = nodeData.nodes.length;
        nodeData.nodes.push({
          'title': '',
          'translation': '',
          'nodes': []
        });
        $scope.selectNode(nodeData.nodes[newIdx]);
      };

      $scope.showNode = function () {

      };

      $scope.save = function () {
        DialogsService.save(
          $scope.id,
          $scope.title,
          $scope.storyId,
          $scope.whoStarts,
          $scope.data
        )
          .then(function () {
            Notification.success('Dialog saved/updated successfully!');
            $location.path('/dialogs/DialogsManagement');
          })
          .catch(function (err) {
            Notification.error('Unable to save dialog.', err);
          });
      };

    }]);
