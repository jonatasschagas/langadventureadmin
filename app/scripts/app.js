'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'facebook',
    'ui-notification',
    'ui.bootstrap',
    'ui.tree',
    'checklist-model',
    'ngLodash',
    'angular-confirm'
  ])
  .config([
    '$routeProvider',
    'FacebookProvider',
    'NotificationProvider',
    function ($routeProvider,
              FacebookProvider,
              NotificationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main',
          activeTab: 'Home'
        })
        .when('/authentication', {
          templateUrl: 'views/authentication.html',
          controller: 'AuthenticationCtrl',
          controllerAs: 'authentication'
        })
        .when('/adminUsers/AdminUserManagement', {
          templateUrl: 'views/adminUsers/adminusermanagement.html',
          controller: 'AdminUserManagementCtrl',
          controllerAs: 'AdminUserManagement',
          activeTab: 'Users'
        })
        .when('/Unauthorized', {
          templateUrl: 'views/unauthorized.html',
          controller: 'UnauthorizedCtrl',
          controllerAs: 'Unauthorized'
        })
        .when('/story/StoryManagement', {
          templateUrl: 'views/story/storymanagement.html',
          controller: 'StoryStoryManagementCtrl',
          controllerAs: 'story/StoryManagement',
          activeTab: 'Stories'
        })
        .when('/story/EditStory', {
          templateUrl: 'views/story/editstory.html',
          controller: 'StoryEditStoryCtrl',
          controllerAs: 'story/EditStory'
        })
        .when('/dialogs/DialogsManagement', {
          templateUrl: 'views/dialogs/dialogsmanagement.html',
          controller: 'DialogsManagementCtrl',
          controllerAs: 'dialogs/DialogsManagement',
          activeTab: 'Dialogs'
        })
        .when('/dialogs/CreateDialog', {
          templateUrl: 'views/dialogs/editdialogs.html',
          controller: 'EditDialogsCtrl',
          controllerAs: 'dialogs/editDialogs',
          activeTab: 'Dialogs'
        })
        .when('/dialogs/EditDialogs/:dialogId', {
          templateUrl: 'views/dialogs/editdialogs.html',
          controller: 'EditDialogsCtrl',
          controllerAs: 'dialogs/editDialogs',
          activeTab: 'Dialogs'
        })
        .otherwise({
          redirectTo: '/'
        });

      // configuring Facebook
      FacebookProvider.init('659183280888234');

      // configuring the notification
      NotificationProvider.setOptions({
        delay: 10000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'top'
      });

    }])
  .constant('CONFIG', {
    'lambdaArn': 'arn:aws:lambda:us-east-1:117472117844:function:langadventurebackend-nodejsbackend-',
    'lambdaEnv': 'development',
    'awsAccountId': '117472117844',
    'awsRegion': 'us-east-1',
    'cognitoRole': 'arn:aws:iam::117472117844:role/Cognito_langadventureAuth_Role',
    'cognitoIdentityPoolId': 'us-east-1:f1f17a72-9537-486b-90a8-29a0098e1175'
  })
  .run([
    '$rootScope',
    '$location',
    '$route',
    'AuthenticationService',
    function ($rootScope,
              $location,
              $route,
              AuthenticationService) {

      var newPage = $location.path();

      // redirects to the authentication if user is not
      // authenticated
      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray(newPage, ['/authentication']) === -1;
        if (restrictedPage) {
          AuthenticationService.verifyAuthentication()
            .then(function (isAuthenticated) {
              if (!isAuthenticated) {
                $location.path('/authentication');
              } else {
                $rootScope.$broadcast('userLoggedIn');
              }
            })
            .catch(function (err) {
              $location.path('/authentication');
            });
        }
      });

    }]);
