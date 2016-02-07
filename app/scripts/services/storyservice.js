'use strict';

/**
 * @ngdoc service
 * @name frontendApp.StoryService
 * @description
 * # StoryService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('StoryService', [
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

      this.save = function (id, title, targetLanguage, translatedLanguage) {
        return LambdaService.callLambda(
          'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-save:development',
          {
            'id': id,
            'title': title,
            'targetLanguage': targetLanguage,
            'translatedLanguage': translatedLanguage
          }
        );
      };

    }]);
