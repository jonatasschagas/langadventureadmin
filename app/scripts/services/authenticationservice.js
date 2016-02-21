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
  .service('AuthenticationService', [
    '$rootScope',
    'Facebook',
    'LambdaService',
    'AuthenticationHolderService',
    'lodash',
    function (
      $rootScope,
      Facebook,
      LambdaService,
      AuthenticationHolderService,
      _) {

      var self = this;

      /**
       * logins against Facebook API and stores the response in a cookie
       */
      this.login = function () {

        // step 1: authenticate with Facebook
        return new Promise(function (fulfill, reject) {
          Facebook.getLoginStatus(function (response) {
            if (response.status == 'connected') {
              self.fbAccessToken = response.authResponse.accessToken;
              self.fbUserId = response.authResponse.userID;
              return fulfill(true);
            } else {
              return fulfill(false);
            }
          });
        })
          .then(function (isLoggedInToFB) {
            if (isLoggedInToFB) {
              return Promise.resolve();
            } else {
              return new Promise(function (fulfill, reject) {
                Facebook.login(function (response) {
                  if (!_.isEmpty(response.authResponse)) { // logged in
                    self.fbAccessToken = response.authResponse.accessToken;
                    self.fbUserId = response.authResponse.userID;
                    fulfill();
                  } else {
                    fulfill();
                  }
                });
              });
            }
          })
          // step 2: get user's name from Facebook
          .then(function () {
            return new Promise(function (fulfill, reject) {
              Facebook.api('/me', function (response) {
                if (!_.isEmpty(response.name)) { // logged in
                  self.userName = response.name;
                  fulfill();
                } else {
                  fulfill();
                }
              });
            });
          })
          // step 3: establishes authentication, so we can call the
          // lambda function to register the user
          .then(function () {
            return AuthenticationHolderService.isAuthenticatedToCognito(self.fbAccessToken);
          })
          .then(function (isAuthenticated) {
            return isAuthenticated ? Promise.resolve() : Promise.reject();
          })
          // step 4: register in the backend that the user has logged in and
          // fetch his roles.
          .then(function () {
            return self.registerAccess(self.fbUserId, self.userName);
          })
          .then(function (response) {
            if (!_.isEmpty(response.data.userRoles)) {
              AuthenticationHolderService.saveUserInfo(
                self.fbUserId,
                self.fbAccessToken,
                self.userName,
                response.data.userRoles);
              return Promise.resolve('Good to see you, ' + self.userName + '.');
            } else {
              return Promise.reject('Unable to fetch user\'s roles. Please try again.');
            }
          }).catch(function (err) {
            console.error('Error connecting to Facebook.', err);
          });
      };

      /**
       * this method logically belongs to the AdminUserService, but in order to avoid circular dependency,
       * I decided to keep it here
       * @param fbUserId
       * @param userName
       */
      this.registerAccess = function (fbUserId, userName) {
        return LambdaService.callLambda(
          'admin_user-register',
          {'fbUserId': fbUserId, 'userName': userName});
      };

      /**
       * checks if the user is authenticated or not
       * @param callback
       */
      this.verifyAuthentication = function () {
        if (AuthenticationHolderService.isAuthenticated()) {
          return Promise.resolve(true);
        }
        // checking if the cookies are there...
        if (_.isEmpty(AuthenticationHolderService.getUserInfo())) {
          return Promise.resolve(false);
        }

        // checks if we're authenticated against cognito
        return AuthenticationHolderService.isAuthenticatedToCognito();
      };

    }
  ])
;
