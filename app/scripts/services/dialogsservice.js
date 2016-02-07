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

      this.save = function (id, title, storyId, whoStarts, nodes) {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-dialog-save:development',
          {
            'id': id,
            'title': title,
            'storyId': storyId,
            'whoStarts': whoStarts,
            'nodes': nodes
          }
        );
      };

      this.get = function (dialogId) {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-dialog-get:development',
          {
            'dialogId': dialogId
          }
        );
      };

      this.list = function (storyId) {
        console.log('Loading dialogs from story Id: ' + storyId);
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-dialog-list:development',
          {
            'storyId': storyId
          }
        );
      };

      this.delete = function (id) {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-dialog-delete:development',
          {
            'id': id
          }
        );
      };

    }]);
