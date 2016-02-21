'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:NpcManagementCtrl
 * @description
 * # NpcManagementCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('NpcManagementCtrl',
  [
    '$scope',
    '$location',
    '$uibModal',
    'AuthenticationHolderService',
    'NPCService',
    'Notification',
    'lodash',
    function ($scope, $location, $uibModal, AuthenticationHolderService, NPCService, Notification, _) {

      if (!AuthenticationHolderService.userHasRole('writer')
        && !AuthenticationHolderService.userHasRole('admin')) {
        $location.path('/Unauthorized');
      }

      $scope.reload = function () {
        NPCService.list()
          .then(function (response) {
            $scope.npcs = [];
            $scope.npcs.push.apply($scope.npcs, response.data.items);
            $scope.$apply();
          })
          .catch(function (err) {
            Notification.error('Unable to list the npcs.', err);
          });
      };

      $scope.reload();

      $scope.edit = function (npc) {
        var editInstance = $uibModal.open({
          animation: true,
          templateUrl: '../../../views/npc/editnpc.html',
          controller: 'EditNpcCtrl',
          size: 'lg',
          resolve: {
            npc: function () {
              return npc;
            }
          }
        });

        editInstance.result.then(function () {
          $scope.reload();
        }, function () {
          $scope.reload();
        });
      };

      $scope.delete = function (npc) {
        console.log('Deleting npc ID: ' + npc.ID);
        NPCService.delete(npc.ID)
          .then(function () {
            Notification.success('Npc has been deleted successfully.');
            $scope.reload();
          })
          .catch(function (err) {
            Notification.error('Unable to delete Npc.', err);
          });
      };

    }]);
