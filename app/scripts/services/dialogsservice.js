'use strict';

/**
 * @ngdoc service
 * @name frontendApp.dialogsservice
 * @description
 *
 * Saves/Queries/Deletes dialogs
 *
 * # dialogsservice
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('DialogsService',
  [
    'LambdaService',
    function (LambdaService) {

      this.save = function (id, npcId, questId, questionCompletion, nodes) {
        return LambdaService.callLambda('dialog-save',
          {
            'id': id,
            'npcId': npcId,
            'questId': questId,
            'questionCompletion': questionCompletion,
            'nodes': nodes
          }
        );
      };

      this.get = function (dialogId) {
        return LambdaService.callLambda('dialog-get', {'dialogId': dialogId});
      };

      this.list = function (questId) {
        console.log('Loading dialogs from quest Id: ' + questId);
        return LambdaService.callLambda('dialog-list', { 'questId': questId});
      };

      this.delete = function (id) {
        return LambdaService.callLambda('dialog-delete', {'id': id});
      };

    }]);
