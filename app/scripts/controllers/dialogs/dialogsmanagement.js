'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DialogsDialogsmanagementCtrl
 * @description
 * # DialogsDialogsmanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DialogsDialogsmanagementCtrl', function ($scope, $location, Notification, DialogsService) {

    $scope.templateUrl = "nodePopOverTemplate.html";

    $scope.stories = [
      {'id': 1, 'title': 'LangAdventure: Learn Finnish'},
      {'id': 2, 'title': 'LangAdventure: Learn Spanish'}
    ];

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

    $scope.selectNode = function(node) {
      $scope.currentText = node.title;
      $scope.currentTranslation = node.translation;
      $scope.currentNode = node;
    };

    $scope.changeNode = function() {
      if($scope.currentNode) {
        $scope.currentNode.title = $scope.currentText;
        $scope.currentNode.translation = $scope.currentTranslation;
      }
    };

    $scope.cutSize = function(title) {
      if(title && title.length > 50) {
        return title.substring(0,50) + '...';
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

    $scope.showNode = function() {

    };

    $scope.save = function() {
      DialogsService.save(
        $scope.id,
        $scope.title,
        $scope.storyId,
        $scope.whoStarts,
        $scope.data,
        function (response) {
          if(response.success) {
            Notification.success('Dialog saved/updated successfully!');
            $location.path('/DialogsManagement');
          } else {
            Notification.error(response.message);
          }
        }
      );
    };

  });
