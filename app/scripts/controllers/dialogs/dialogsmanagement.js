'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DialogsDialogsmanagementCtrl
 * @description
 * # DialogsDialogsmanagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DialogsDialogsmanagementCtrl', function ($scope) {

    $scope.data = [{
      'title': 'This is the first node...',
      'nodes': []
    }];

    $scope.currentText = $scope.data[0].title;
    $scope.currentNode = $scope.data[0];

    $scope.remove = function (scope) {
      scope.remove();
    };

    $scope.toggle = function (scope) {
      scope.toggle();
    };

    $scope.selectNode = function(node) {
      $scope.currentText = node.title;
      $scope.currentNode = node;
    };

    $scope.changeNode = function() {
      if($scope.currentNode) {
        $scope.currentNode.title = $scope.currentText;
      }
    };

    $scope.cutSize = function(text) {
      if(text.length > 50) {
        return text.substring(0,50) + '...';
      } else {
        return text;
      }
    };

    $scope.moveLastToTheBeginning = function () {
      var a = $scope.data.pop();
      $scope.data.splice(0, 0, a);
    };

    $scope.newSubItem = function (scope) {
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
        nodes: []
      });
    };

  });
