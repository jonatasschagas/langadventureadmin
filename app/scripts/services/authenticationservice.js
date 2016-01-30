'use strict';

/**
 * @ngdoc service
 * @name frontendApp.AuthenticationService
 * @description
 *
 * This service uses Facebook to authenticate the User and also authenticates against Cognito
 * Identity Pool. Cognito in return creates temporary roles for the authenticated user. This temporary
 * role is used to invoke the lambda functions.
 *
 * # AuthenticationService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('AuthenticationService', function ($cookieStore, $rootScope, Facebook) {

    this.login = function (callback) {
      Facebook.login(function (response) {
        if (response.authResponse) { // logged in
          var accessToken = response.authResponse.accessToken;
          Facebook.api('/me', function (response) {
            var globals = {
              currentUser: {
                username: response.name,
                fbToken: accessToken
              }
            };
            $cookieStore.put('globals', globals);
            callback({'success': true, 'message': 'Good to see you, ' + response.name + '.'});
          });
        } else {
          callback({'success': false, 'message': 'There was a problem logging you in. Try again.'});
        }
      });
    };

    this.getUserInfo = function() {
      var globals = $cookieStore.get('globals');
      return globals &&  globals.currentUser ? globals.currentUser : false;
    };

  });
