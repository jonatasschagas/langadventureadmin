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
      LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-delete:development',
        {'id': id},
        function (response) {
          callback(response);
        }
      );
    };

    this.list = function (callback) {
      LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-list:development',
        {},
        function (response) {
          callback(response);
        }
      );
    };

    this.save = function (id, title, targetLanguage, translatedLanguage, callback) {
      LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-story-save:development',
        {
          'id': id,
          'title': title,
          'targetLanguage': targetLanguage,
          'translatedLanguage': translatedLanguage
        },
        function (response) {
          callback(response);
        }
      );
    };

  });
