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
  [
    '$scope',
    '$uibModal',
    'lodash',
    'Notification',
    function ($scope, $uibModal, _, Notification) {

      $scope.npcs = [
        {Title: "Maria", ID: "XXXXXXX"},
        {Title: "Peter", ID: "YYYYY"}
      ];

      $scope.quests = [
        {Title: "Find the city center", ID: "XXXXXXX"},
        {Title: "Find you son", ID: "YYYYY"}
      ];

      $scope.parentAnswers = [{
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

      // triggers the edit question modal
      $scope.editItem = function (node) {
        $scope.selectedItem = node;
        handleEditQuestionDialog($scope.selectedItem);
      };

      // used to limit the size from the item's title
      $scope.cut = function (title) {
        if (title && title.length > 50) {
          return title.substring(0, 50) + '...';
        } else {
          return title;
        }
      };

      // removes the item from the dialog tree
      $scope.removeItem = function (node, scope) {
        removeItem($scope.data[0], node);
        scope.remove();

        function removeItem(node, item) {
          // removing parent item
          if (node.id == item.id) {
            node = null;
          }
          if (!$scope.data) {
            $scope.data = [];
            $scope.parentAnswers = [];
          }
        }

      };

      // opens the edit question dialog
      $scope.createQuestion = function () {
        handleEditQuestionDialog(null);
      };

      // returns an array with the answers from the dialog tree
      $scope.getParentAnswers = function() {
        function appendAnswers(answers, arrayToAppend) {
          if (answers == null) {
            return arrayToAppend;
          }
          arrayToAppend = [].concat(arrayToAppend, answers);
          for (var idx = 0; idx < answers.length; idx++) {
            var nextQuestion = answers[idx].next;
            if(nextQuestion && nextQuestion.length > 0 && nextQuestion[0]) {
              arrayToAppend = appendAnswers(nextQuestion[0].answers, arrayToAppend);
            }
          }
          return arrayToAppend;
        }
        return appendAnswers($scope.data[0].answers, []);
      };

      // handles the modal that is used to create/edit the dialog items
      function handleEditQuestionDialog(item) {

        var questionInstance = $uibModal.open({
          animation: true,
          templateUrl: '../../../views/dialogs/editdialogitem.html',
          controller: 'EditDialogItemCtrl',
          size: 'lg',
          resolve: {
            parentAnswers: function () {
              return $scope.getParentAnswers();
            },
            item: function () {
              return item;
            }
          }
        });

        questionInstance.result.then(function (result) {
          function appendQuestionItem(node, item) {
            if (node.answers == null) {
              return;
            }
            if(node.id == item.id) {
              node.text = item.text;
              node.translation = item.translation;
              node.parent = item.parent;
              node.answers = item.answers;
              return;
            }
            for (var i = 0; i < node.answers.length; i++) {
              var currAnswer = node.answers[i];
              if (currAnswer.id == item.parent) {
                currAnswer.next = [item];
                return;
              } else if (currAnswer.next) {
                appendQuestionItem(currAnswer.next[0], item);
              }
            }
          }

          // appending item to the tree
          if ($scope.data) {
            appendQuestionItem($scope.data[0], result);
          } else {
            $scope.data = [result];
          }

          Notification.success("Question/Statement "
            + result.text + " created/edited successfully.");

        }, function () {
        });
      }

    }])
  .controller('EditDialogItemCtrl',
  [
    '$scope',
    '$uibModalInstance',
    'Notification',
    'parentAnswers',
    'item',
    function ($scope, $uibModalInstance, Notification, parentAnswers, item) {

      $scope.parentAnswers = parentAnswers;
      $scope.answers = [];

      if (item) {
        $scope.id = item.id;
        $scope.parent = item.parent;
        $scope.text = item.text;
        $scope.translation = item.translation;
        $scope.answers = item.answers;
      } else {
        $scope.id = null;
        $scope.parent = null;
        $scope.text = null;
        $scope.translation = null;
      }

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

      $scope.addAnswer = function() {
        $scope.answers.push({ id: guid(), type: "answer" });
      };

      $scope.deleteAnswer = function(answerIdx) {
        $scope.answers.splice(answerIdx, 1);
      };

      $scope.save = function () {

        if($scope.answers.length == 0) {
          Notification.error("Please add at least one Answer.");
          return;
        }

        $uibModalInstance.close({
          id: $scope.id ? $scope.id : guid(),
          parent: $scope.parent,
          text: $scope.text,
          translation: $scope.translation,
          type: "question",
          answers: $scope.answers
        });

      };

    }]);
