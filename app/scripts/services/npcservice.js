'use strict';

/**
 * @ngdoc service
 * @name frontendApp.NPCService
 * @description
 * # StoryService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('NPCService', [
    'LambdaService',
    function (LambdaService) {

      this.delete = function (id) {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-delete:development',
          {'id': id}
        );
      };

      this.list = function () {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-list:development',
          {}
        );
      };

      this.save = function (id, names, description) {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-npc-save:development',
          {
            'id': id,
            'names': names,
            'description': description
          }
        );
      };

    }]);
