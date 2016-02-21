'use strict';

/**
 * @ngdoc service
 * @name frontendApp.NPCService
 * @description
 * # NPCService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('NPCService', [
    'LambdaService',
    function (LambdaService) {

      this.delete = function (id) {
        return LambdaService.callLambda('npc-delete', {'id': id});
      };

      this.list = function () {
        return LambdaService.callLambda('npc-list',{});
      };

      this.save = function (id, npcNames, description) {
        return LambdaService.callLambda('npc-save',
          {
            'id': id,
            'npcNames': npcNames,
            'description': description
          }
        );
      };

    }]);
