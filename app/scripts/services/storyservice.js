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
        return LambdaService.callLambda('story-delete', {'id': id}
        );
      };

      this.list = function () {
        return LambdaService.callLambda('story-list', {}
        );
      };

      this.save = function (id, title, targetLanguage, translatedLanguage) {
        return LambdaService.callLambda('story-save',
          {
            'id': id,
            'title': title,
            'targetLanguage': targetLanguage,
            'translatedLanguage': translatedLanguage
          }
        );
      };

    }]);
