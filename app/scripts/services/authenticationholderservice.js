'use strict';

/**
 * @ngdoc service
 * @name frontendApp.AuthenticationHolderService
 * @description
 *
 * Keeps the state from the User
 *
 * # AuthenticationHolderService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('AuthenticationHolderService', function ($cookies) {

    /**
     * returns the information from the user stored in the cookies
     */
    this.getUserInfo = function () {
      var globals = $cookies.getObject('globals');
      return globals && globals.currentUser ? globals.currentUser : false;
    };

    /**
     * saves the user info in the cookie
     * @param fbUserId
     * @param fbAccessToken
     * @param userName
     * @param userRoles
     */
    this.saveUserInfo = function (fbUserId, fbAccessToken, userName, userRoles) {
      if (!fbUserId || !fbAccessToken || !userName || !userRoles) {
        return;
      }
      var globals = {
        currentUser: {
          userName: userName,
          userRoles: userRoles,
          fbToken: fbAccessToken,
          fbUserId: fbUserId
        }
      };
      $cookies.putObject('globals', globals);
    };

    var self = this;
    this.isUserAuhenticated = false;
    /**
     * Tells if the user is authenticated or not
     * @returns {boolean}
     */
    this.isAuthenticated = function () {
      return self.isUserAuhenticated;
    };

    /**
     * Destroys the auth cookie
     */
    this.logout = function () {
      $cookies.remove('globals');
      self.isUserAuhenticated = false;
    };

    /**
     * Checks if that fbToken is authenticated against Cognito. If Cognito is authenticated, we can execute
     * lambda functions.
     * @param fbToken
     * @param callback
     */
    this.isAuthenticatedToCognito = function (fbToken, callback) {
      AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
          AccountId: '117472117844',
          RoleArn: 'arn:aws:iam::117472117844:role/Cognito_langadventureAuth_Role',
          IdentityPoolId: 'us-east-1:f1f17a72-9537-486b-90a8-29a0098e1175',
          Logins: {
            'graph.facebook.com': fbToken
          }
        })
      });

      // getting credentials
      AWS.config.credentials.get(function (err) {
        if (!err) {
          // sets the user as authenticated
          self.isUserAuhenticated = true;
          callback(true);
        } else {
          callback(false);
        }
      });
    };

    this.userHasRole = function (role) {
      var userRoles = self.getUserInfo().userRoles;
      for (var idx in userRoles) {
        if (userRoles[idx] == role) {
          return true;
        }
      }
      return false;
    };

  });
