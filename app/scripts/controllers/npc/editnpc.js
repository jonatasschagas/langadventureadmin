'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditNpcCtrl
 * @description
 * # EditNpcCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditNpcCtrl',
  [
    '$scope',
    '$uibModalInstance',
    'CONFIG',
    'Notification',
    'NPCService',
    'npc',
    function ($scope,
              $uibModalInstance,
              CONFIG,
              Notification,
              NPCService,
              npc) {

      $scope.languages = CONFIG.languages;

      $scope.npcNames = [];
      if (npc != null) {
        $scope.npc = npc;
        $scope.npcNames = npc.NpcNames;
        $scope.description = npc.Description;
        $scope.ID = npc ? npc.ID : null;
      }

      $scope.addName = function() {
        $scope.npcNames.push({"name": "", "language": ""});
      };

      $scope.deleteName = function(idx) {
        $scope.npcNames.splice(idx, 1);
      };

      $scope.save = function (isValid) {

        if(!isValid) {
          return;
        }

        if($scope.npcNames.length < 1) {
          Notification.error("Add at least one name for the NPC.");
          return;
        }

        NPCService.save(
          $scope.ID,
          $scope.npcNames,
          $scope.description
        )
          .then(function (response) {
            Notification.success(response.message);
            $uibModalInstance.close();
          })
          .catch(function (err) {
            console.error('Error saving the npc record.', err);
            Notification.error('Error saving the npc record.');
          });
      };

      $scope.checkErrors = function(formItem) {
        return formItem.$invalid && !formItem.$pristine
      };

    }]);

