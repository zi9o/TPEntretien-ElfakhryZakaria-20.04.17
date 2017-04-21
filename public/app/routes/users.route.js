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
      .state('createUser', {
        url: '/createUser',
        templateUrl: 'app/views/users/create.user.html',
        controller: 'CreateUserController',
        controllerAs:'CtrlCreateUser'
      })
  }
})();