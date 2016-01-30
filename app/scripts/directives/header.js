'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:header
 * @description
 * # header
 */
angular.module('frontendApp')
  .directive('header', function () {
    return {
      templateUrl: '/views/header.html',
      restrict: 'A',
      scope: {user: '='},
      replace: true,
      controller: ['$scope', '$filter', function ($scope, $filter) {
        // Your behaviour goes here :)
      }]
    };
  });
