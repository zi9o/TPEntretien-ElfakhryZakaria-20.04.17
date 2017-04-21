/**
 * Created by Zakaria on 20/04/2017.
 */
angular.module('phainoUserApp')
  .controller('MainController', ['$http', '$rootScope', '$scope', 'siteUrl', '$state', 'toastr', '$translate',
    function ($http, $rootScope, $scope, siteUrl, $state, toastr, $translate) {
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
      }

      /*
       |--------------------------------------------------------------------------
       | Scoped functions
       |--------------------------------------------------------------------------
       */
      $scope.changeLanguage = function (key) {
        $translate.use(key);
      };
    }]);