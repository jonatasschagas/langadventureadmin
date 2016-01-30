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
  .service('LambdaService', function (AuthenticationService) {

    this.callLambda = function (functionName, functionParameters, callback) {

      AuthenticationService.verifyAuthentication(function (isAuthenticated) {

        if (!isAuthenticated) {
          console.log('Not executing lambda function: ' + functionName + '. User is not authenticated');
          return;
        }

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
              var resData = JSON.parse(responseData.Payload).data;
              callback({
                'success': true,
                'message': 'Lambda function ' + functionName + ' executed successfully.',
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
      });
    };

  })
;
