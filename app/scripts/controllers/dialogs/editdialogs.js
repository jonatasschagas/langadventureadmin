'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditDialogsCtrl
 * @description
 * # EditDialogsCtrl
 * Controller of the frontendApp
 */


/**
 * Generates a random UUID
 * @returns {string}
 */
function guid() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

angular.module('frontendApp')
  .controller('EditDialogsCtrl',
  [
    '$scope',
    '$uibModal',
    'lodash',
    function ($scope, $uibModal, _) {

      $scope.templateUrl = "showNodesContentsTemplate.html";

      $scope.npcs = [
        {Title: "Maria", ID: "XXXXXXX"},
        {Title: "Peter", ID: "YYYYY"}
      ];

      $scope.quests = [
        {Title: "Find the city center", ID: "XXXXXXX"},
        {Title: "Find you son", ID: "YYYYY"}
      ];

      $scope.answers = [{
        "id": "9ceff0b5-ee25-367e-76da-bfe15ef7241e",
        "text": "Hello there!",
        "type": "answer"
      }, {
        "id": "0a365d28-bd36-8ad5-ed8f-0ad6387cc515",
        "text": "Why are you calling me a stranger?",
        "type": "answer"
      }, {"id": "1fc74d51-f927-c870-7310-cd9b6bdda51d", "text": "Hello!", "type": "answer"}];
      ;
      $scope.data = [{
        "id": "671fa95d-9922-6734-68dd-73c32fda9d20",
        "text": "Howdy Stranger!",
        "type": "question",
        "answers": [{
          "id": "9ceff0b5-ee25-367e-76da-bfe15ef7241e",
          "text": "Hello there!",
          "type": "answer"
        }, {
          "id": "0a365d28-bd36-8ad5-ed8f-0ad6387cc515",
          "text": "Why are you calling me a stranger?",
          "type": "answer"
        }, {"id": "1fc74d51-f927-c870-7310-cd9b6bdda51d", "text": "Hello!", "type": "answer"}]
      }];
      ;

      $scope.remove = function (scope) {
        scope.remove();
      };

      $scope.selectNode = function (node) {
        $scope.selectedItem = node;
        $scope.createQuestionOrStatement();
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

      $scope.removeItem = function (node) {
        removeItem($scope.data[0], node);
      };

      function removeItem(node, item) {
        // removing parent item
        if (node.id == item.id) {
          node = null;
        }
        if (!$scope.data) {
          $scope.data = [];
          $scope.answers = [];
        }
      }

      $scope.createQuestionOrStatement = function () {

        var questionOrStatementInstance = $uibModal.open({
          animation: true,
          templateUrl: '../../../views/dialogs/editdialogitem.html',
          controller: 'EditDialogItemCtrl',
          size: 'lg',
          resolve: {
            answers: function () {
              return $scope.answers;
            },
            item: function () {
              return $scope.selectedItem;
            }
          }
        });

        questionOrStatementInstance.result.then(function (result) {
          $scope.answers = [].concat($scope.answers, result.answers);

          function appendItem(node, item) {
            if (node.answers == null) {
              return;
            }
            for (var i = 0; i < node.answers.length; i++) {
              var currAnswer = node.answers[i];
              if (currAnswer.id == item.parent) {
                currAnswer.next = [item];
                return;
              } else if (currAnswer.next) {
                appendItem(currAnswer.next[0], item);
              }
            }
          }

          if ($scope.data) {
            removeItem($scope.data[0], result);
            appendItem($scope.data[0], result);
          } else {
            $scope.data = [result];
          }

          console.log(JSON.stringify($scope.answers));
          console.log(JSON.stringify($scope.data));

        }, function () {
        });
      };

    }])
  .controller('EditDialogItemCtrl',
  [
    '$scope',
    '$uibModalInstance',
    'answers',
    'item',
    function ($scope, $uibModalInstance, answers, item) {

      $scope.answers = answers;

      if (item) {
        $scope.id = item.id;
        $scope.parent = item.parent;
        $scope.text = item.text;
        $scope.translation = item.translation;
        $scope.answer1Id = item.answers[0].id;
        $scope.answer1Text = item.answers[0].text;
        $scope.answer1Translation = item.answers[0].translation;
        $scope.answer2Id = item.answers[1].id;
        $scope.answer2Text = item.answers[1].text;
        $scope.answer2Translation = item.answers[1].translation;
        $scope.answer3Id = item.answers[2].id;
        $scope.answer3Text = item.answers[2].text;
        $scope.answer3Translation = item.answers[2].translation;
      }

      $scope.save = function () {
        $uibModalInstance.close({
          id: $scope.id ? $scope.id : guid(),
          parent: $scope.parent,
          text: $scope.text,
          translation: $scope.translation,
          type: "question",
          answers: [
            {
              id: $scope.answer1Id ? $scope.answer1Id : guid(),
              text: $scope.answer1Text,
              translation: $scope.answer1Translation,
              type: "answer"
            },
            {
              id: $scope.answer1Id ? $scope.answer1Id : guid(),
              text: $scope.answer2Text,
              translation: $scope.answer2Translation,
              type: "answer"
            },
            {
              id: $scope.answer1Id ? $scope.answer1Id : guid(),
              text: $scope.answer3Text,
              translation: $scope.answer3Translation,
              type: "answer"
            }
          ]
        });
      };

    }]);
