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

    var self = this;

    // logins against Facebook API and stores the response in a cookie
    this.login = function (callback) {
      Facebook.login(function (response) {
        if (response.authResponse) { // logged in
          var accessToken = response.authResponse.accessToken;
          var userId = response.authResponse.userID;
          Facebook.api('/me', function (response) {
            var globals = {
              currentUser: {
                username: response.name,
                fbToken: accessToken,
                fbUserId: userId
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

    // returns the information from the user stored in the cookies
    this.getUserInfo = function () {
      var globals = $cookieStore.get('globals');
      return globals && globals.currentUser ? globals.currentUser : false;
    };

    // controls the state whether the user is authenticated or not
    this.isAuthenticated = false;

    // checks if the user is authenticated or not
    this.verifyAuthentication = function (callback) {

      if (self.isAuthenticated) {
        callback(true);
        return;
      }

      // checking if the cookies are there...
      var userInfo = self.getUserInfo();
      if (!userInfo) {
        callback(false);
        return;
      }

      // authenticating against cognito
      AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
          AccountId: '117472117844',
          RoleArn: 'arn:aws:iam::117472117844:role/Cognito_langadventureAuth_Role',
          IdentityPoolId: 'us-east-1:f1f17a72-9537-486b-90a8-29a0098e1175',
          Logins: {
            'graph.facebook.com': userInfo.fbToken
          }
        })
      });

      // getting credentials
      AWS.config.credentials.get(function (err) {
        if (!err) {
          self.isAuthenticated = true;
          callback(true);
        } else {
          self.isAuthenticated = false;
          callback(false);
        }
      });
    };


  });
