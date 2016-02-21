'use strict';

/**
 * @ngdoc service
 * @name frontendApp.QuestService
 * @description
 * # QuestService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('QuestService', [
    'LambdaService',
    function (LambdaService) {

      this.delete = function (id) {
        return LambdaService.callLambda('quest-delete', {'id': id}
        );
      };

      this.list = function (storyId) {
        return LambdaService.callLambda('quest-list', {'storyId': storyId}
        );
      };

      this.save = function (id, questOrder, title, introduction, completion, storyId) {
        return LambdaService.callLambda('quest-save',
          {
            'id': id,
            'title': title,
            'questOrder': questOrder,
            'introduction': introduction,
            'completion': completion,
            'storyId': storyId
          }
        );
      };

    }]);
