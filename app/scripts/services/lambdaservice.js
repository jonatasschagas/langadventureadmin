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
  .service('LambdaService',
  [
    'AuthenticationHolderService',
    function (AuthenticationHolderService) {

      var self = this;

      /**
       * checks if the user is authorized to execute lambda functions. If yes, then executes the function
       * @param functionName
       * @param functionParameters
       */
      this.callLambda = function (functionName, functionParameters) {
        if (AuthenticationHolderService.isAuthenticated()) {
          return self.invokeLambda(functionName, functionParameters);
        } else {
          return AuthenticationHolderService.isAuthenticatedToCognito()
            .then(function (isAuthenticated) {
              if (isAuthenticated) {
                return self.invokeLambda(functionName, functionParameters);
              } else {
                return Promise.reject('User is not authenticated.');
              }
            });
        }
      };

      /**
       * simply invokes the lambda function
       * @param functionName
       * @param functionParameters
       */
      this.invokeLambda = function (functionName, functionParameters) {
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
        return new Promise(function (fulfill, reject) {
          lambda.invoke(params, function (err, responseData) {
            if (err) {
              console.error('Error executing lambda function.', err);
              reject(err);
            } else {
              fulfill(JSON.parse(responseData.Payload));
            }
          });
        });
      };
    }]);
