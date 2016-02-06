'use strict';

/**
 * @ngdoc service
 * @name frontendApp.StoryService
 * @description
 * # StoryService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('StoryService', function () {

    this.delete = function (id, callback) {
      return LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-delete:development',
        {'id': id}
      );
    };

    this.list = function (callback) {
      return LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-list:development',
        {}
      );
    };

    this.save = function (id, title, targetLanguage, translatedLanguage, callback) {
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

  });
