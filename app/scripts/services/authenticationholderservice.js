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
  .service('AuthenticationHolderService', ['$cookies', 'lodash', 'CONFIG',
    function ($cookies, _, CONFIG) {

    /**
     * returns the information from the user stored in the cookies
     */
    this.getUserInfo = function () {
      var globals = $cookies.getObject('globals');
      return !_.isEmpty(globals) && !_.isEmpty(globals.currentUser) ? globals.currentUser : false;
    };

    /**
     * saves the user info in the cookie
     * @param fbUserId
     * @param fbAccessToken
     * @param userName
     * @param userRoles
     */
    this.saveUserInfo = function (fbUserId, fbAccessToken, userName, userRoles) {
      if (_.isEmpty(fbUserId) || _.isEmpty(fbAccessToken) || _.isEmpty(userName) || _.isEmpty(userRoles)) {
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
     * @param callback
     */
    this.isAuthenticatedToCognito = function (fbFreshToken) {

      if(_.isEmpty(fbFreshToken)) {
        fbFreshToken = self.getUserInfo().fbToken;
      }

      AWS.config.update({
        region: CONFIG.awsRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          AccountId: CONFIG.awsAccountId,
          RoleArn: CONFIG.cognitoRole,
          IdentityPoolId: CONFIG.cognitoIdentityPoolId,
          Logins: {
            'graph.facebook.com': fbFreshToken
          }
        })
      });

      // getting credentials
      return new Promise(function (fulfill, reject) {
        // getting credentials
        AWS.config.credentials.get(function (err) {
          if (!err) {
            // sets the user as authenticated
            self.isUserAuhenticated = true;
            fulfill(true);
          } else {
            console.error('Error retrieving AWS credentials.', err);
            reject(err);
          }
        });
      }).then(function () {
          self.isUserAuhenticated = true;
          return Promise.resolve(true);
        })
    };

    this.userHasRole = function (role) {
      return _.filter(self.getUserInfo().userRoles, function(r) { return r == role }).length > 0;
    };

  }]);
