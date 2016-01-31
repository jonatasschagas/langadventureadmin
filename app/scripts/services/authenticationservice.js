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
  .service('AuthenticationService', function ($rootScope, Facebook, LambdaService, AuthenticationHolderService) {

    var self = this;

    /**
     * logins against Facebook API and stores the response in a cookie
     * @param callback
     */
    this.login = function (callback) {
      // step 1: authenticate with Facebook
      Facebook.login(function (response) {
        if (response.authResponse) { // logged in
          var fbAccessToken = response.authResponse.accessToken;
          var fbUserId = response.authResponse.userID;
          // step 2: get user's name from Facebook
          Facebook.api('/me', function (response) {
            if (response && response.name) {
              var userName = response.name;
              // step 3: establishes authentication, so we can call the
              // lambda function to register the user
              AuthenticationHolderService.isAuthenticatedToCognito(fbAccessToken, function (isAuthenticated) {
                if (isAuthenticated) {
                  // step 4: register in the backend that the user has logged in and
                  // fetch his roles.
                  self.registerAccess(fbUserId, userName, function (response) {
                    if (response.success) {
                      // step 4: write all the information to cookies
                      var userRoles = response.data.userRoles;
                      // stores the user information
                      AuthenticationHolderService.saveUserInfo(fbUserId, fbAccessToken, userName, userRoles);
                      callback({'success': true, 'message': 'Good to see you, ' + userName + '.'});
                    } else {
                      callback({'success': false, 'message': 'There was a problem logging you in. Try again.'});
                    }
                  });
                } else {
                  callback({'success': false, 'message': 'There was a problem logging you in. Try again.'});
                }
              });
            } else {
              callback({'success': false, 'message': 'There was a problem logging you in. Try again.'});
            }
          });
        } else {
          callback({'success': false, 'message': 'There was a problem logging you in. Try again.'});
        }
      });
    };

    /**
     * this method logically belongs to the AdminUserService, but in order to avoid circular dependency,
     * I decided to keep it here
     * @param fbUserId
     * @param userName
     * @param callback
     */
    this.registerAccess = function (fbUserId, userName, callback) {
      LambdaService.callLambda(
        'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-admin_user-register:development',
        {'fbUserId': fbUserId, 'userName': userName},
        function (response) {
          if (response.success) {
            callback({
              'success': true,
              'message': 'Admin user ' + userName + ' has been registered successfully.',
              'data': response.data
            });
          } else {
            callback({
              'success': false,
              'message': 'Unable to register user ' + userName + '.'
            });
          }
        }
      )
    };

    /**
     * checks if the user is authenticated or not
     * @param callback
     */
    this.verifyAuthentication = function (callback) {
      if (AuthenticationHolderService.isAuthenticated()) {
        callback(true);
        return;
      }
      // checking if the cookies are there...
      var userInfo = AuthenticationHolderService.getUserInfo();
      if (!userInfo) {
        callback(false);
        return;
      }

      // checks if we're authenticated against cognito
      AuthenticationHolderService.isAuthenticatedToCognito(userInfo.fbToken, function (isAuthenticated) {
        callback(isAuthenticated);
      });

    };

  });
