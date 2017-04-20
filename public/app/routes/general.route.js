/**
 * Created by Zakaria on 20/04/2017.
 */
(function () {
  'use strict';
  angular.module('phainoUserApp')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('default', {
        url: '/default',
        templateUrl: 'app/views/default.html',
      })
  }
})();
