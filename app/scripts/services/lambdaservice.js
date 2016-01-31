'use strict';

/**
 * @ngdoc service
 * @name frontendApp.lambdaService
 * @description
 *
 * This service encapsulates the boilerplate code used to invoke lambda functions.
 *
 * # lambdaService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('LambdaService', function (AuthenticationHolderService) {

    var self = this;

    /**
     * checks if the user is authorized to execute lambda functions. If yes, then executes the function
     * @param functionName
     * @param functionParameters
     * @param callback
     */
    this.callLambda = function (functionName, functionParameters, callback) {
      if (AuthenticationHolderService.isAuthenticated()) {
        self.invokeLambda(functionName, functionParameters, callback);
      } else {
        AuthenticationHolderService.isAuthenticatedToCognito(AuthenticationHolderService.getUserInfo().fbToken,
        function(isAuthenticated){
          if(isAuthenticated) {
            self.invokeLambda(functionName, functionParameters, callback);
          } else {
            console.log('Not executing lambda function: ' + functionName + '. User is not authenticated');
            callback({
              'success': false,
              'message': 'Not authenticated to Cognito. Unable to call the lambda function: ' + functionName
            });
          }
        });
      }
    };

    /**
     * simply invokes the lambda function
     * @param functionName
     * @param functionParameters
     * @param callback
     */
    this.invokeLambda = function (functionName, functionParameters, callback) {
      var lambda = new AWS.Lambda({
        credentials: AWS.config.credentials,
        region: 'us-east-1',
        sslEnabled: true
      });
      var params = {
        FunctionName: functionName,
        Payload: JSON.stringify(functionParameters),
        InvocationType: 'RequestResponse'
      };
      lambda.invoke(params, function (err, responseData) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          callback({'success': false, 'message': 'Unable to execute lambda function: ' + functionName});
        } else {
          try {
            var resData = JSON.parse(responseData.Payload);
            callback({
              'success': resData.success,
              'message': resData.message,
              'data': resData.data
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
    };

  })
;
