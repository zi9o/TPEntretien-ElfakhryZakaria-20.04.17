/**
 * Created by Zakaria on 20/04/2017.
 */
angular.module('phainoUserApp')
  .controller('HomeController', ['$http', '$rootScope', '$scope', 'siteUrl', '$state', 'toastr', '$timeout',
    function ($http, $rootScope, $scope, siteUrl, $state, toastr, $timeout) {

      $scope.currentPage = 1;
      $scope.pageSize = 5;
      /*
       * first action on view load
       */
      init();
      /*
       |--------------------------------------------------------------------------
       | Needed functions
       |--------------------------------------------------------------------------
       */
      function init() {
        initUsers();
      }

      /*
       * load all users from database
       */
      function initUsers() {
        $http.get(siteUrl.apiUrl + 'users').then(function (resp, status, headers, config) {
          $scope.users = resp.data;
        }, function (resp) {
          toastr.error(resp.data.message)
        })
      };

      /*
       |--------------------------------------------------------------------------
       | Scoped functions
       |--------------------------------------------------------------------------
       */
      $scope.refreshUser = function () {
        initUsers();
      }
    }]);