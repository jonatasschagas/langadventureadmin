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
    'checklist-model'
  ])
  .config(function ($routeProvider, FacebookProvider, NotificationProvider) {
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
      .when('/AdminUserManagement', {
        templateUrl: 'views/adminUsers/adminusermanagement.html',
        controller: 'AdminusermanagementCtrl',
        controllerAs: 'AdminUserManagement',
        activeTab: 'Users'
      })
      .when('/Unauthorized', {
        templateUrl: 'views/unauthorized.html',
        controller: 'UnauthorizedCtrl',
        controllerAs: 'Unauthorized'
      })
      .when('/DialogsManagement', {
        templateUrl: 'views/dialogs/dialogsmanagement.html',
        controller: 'DialogsDialogsmanagementCtrl',
        controllerAs: 'dialogs/DialogsManagement',
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

  })
  .run(function ($rootScope, $location, $route, AuthenticationService) {

    var newPage = $location.path();

    // redirects to the authentication if user is not
    // authenticated
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = $.inArray(newPage, ['/authentication']) === -1;
      if (restrictedPage) {
        AuthenticationService.verifyAuthentication(function (isAuthenticated) {
          if (!isAuthenticated) {
            $location.path('/authentication');
          } else {
            $rootScope.$broadcast('userLoggedIn');
          }
        });
      }
    });

  });
