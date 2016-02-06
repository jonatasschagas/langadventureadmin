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
  .service('DialogsService', function (LambdaService) {

    this.save = function(id, title, storyId, whoStarts, nodes) {
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

  });
