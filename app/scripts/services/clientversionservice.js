'use strict';

/**
 * @ngdoc service
 * @name frontendApp.ClientVersionService
 * @description
 * # ClientVersionService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('ClientVersionService', function (AuthenticationService) {

    this.listClientVersions = function (callback) {

      var userInfo = AuthenticationService.getUserInfo();

      if (!userInfo) {
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

      AWS.config.credentials.get(function (err) {
        if (!err) {
          var lambda = new AWS.Lambda({
            credentials: AWS.config.credentials,
            region: 'us-east-1',
            sslEnabled: true
          });
          var params = {
            FunctionName: 'langadventurebackend-nodejsbackend-client_version-list', /* required */
            InvocationType: 'RequestResponse'
          };
          lambda.invoke(params, function (err, responseData) {
            if (err) {
              console.log(err, err.stack); // an error occurred
              callback({'success': false, 'message': 'Unable to list client versions.'});
            } else {
              try {
                var resData = JSON.parse(responseData.Payload).data;
                callback({
                  'success': true,
                  'message': 'List of client versions retrieved successfully.',
                  'data': resData
                });
              } catch (err) {
                console.log(err, err.stack); // an error occurred
                callback({
                  'success': false,
                  'message': 'Unable to process response from the server.',
                  'data': responseData.Payload
                });
              }
            }
          });
        }
      });
    };

  });
