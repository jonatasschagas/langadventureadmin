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
    'ui-notification'
  ])
  .config(function ($routeProvider, FacebookProvider, NotificationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/authentication', {
        templateUrl: 'views/authentication.html',
        controller: 'AuthenticationCtrl',
        controllerAs: 'authentication'
      })
      .otherwise({
        redirectTo: '/authentication'
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
  .run(function ($rootScope, $location, $cookieStore) {

    // redirects to the authentication if user is not
    // authenticated
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = $.inArray($location.path(), ['/authentication']) === -1;
      var globals = $cookieStore.get('globals');
      var loggedIn = globals &&  globals.currentUser ? globals.currentUser : false;
      if (restrictedPage && !loggedIn) {
        console.log('not logged in');
        $location.path('/authentication');
      }
    });

  });
