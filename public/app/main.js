/**
 * Created by Zakaria on 20/04/2017.
 */
'use Strict'

var config_module = angular.module('phainoUserApp.config', []);
var config_data = {
  'GENERAL_CONFIG': {
    'APP_NAME': 'PhainoTest',
    'APP_VERSION': '0.1',
    'PROTOCOL': 'http',
    'HOST': 'localhost',
    'PORT': 3000
  }
};
angular.forEach(config_data, function (key, value) {
  config_module.constant(value, key);
});
var appPhaino = angular.module('phainoUserApp',
  ['phainoUserApp.config', 'ui.router', 'angularUtils.directives.dirPagination',
    'ui.bootstrap', 'ngMessages', 'ngResource', 'toastr', 'ngAnimate', 'ngTouch',
    'ngFileUpload', 'angular-loading-bar', 'angular-ladda','pascalprecht.translate']);

/*
 |--------------------------------------------------------------------------
 | Handling http rejection showed error in console
 |--------------------------------------------------------------------------
 */
angular.module('phainoUserApp')
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])

  /*
   |--------------------------------------------------------------------------
   | Config for setting up template for pagination
   |--------------------------------------------------------------------------
   */
  .config(function (paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/app/views/templates/dirPagination.tpl.html');
  })

  /*
   |--------------------------------------------------------------------------
   | Config for setting loading bar
   |--------------------------------------------------------------------------
   */
  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>'; // template of loading bar
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.latencyThreshold = 70; // ignore when request doesn't take more than 50ms
  }])

  /*
   |--------------------------------------------------------------------------
   | Config for setting loading circle when clicking on buttons
   |--------------------------------------------------------------------------
   */
  .config(function (laddaProvider) {
    laddaProvider.setOption({
      /* optional */
      // style: 'expand-right',
      spinnerSize: 35,
      spinnerColor: '#253CFF'
    });
  })

  /*
   |--------------------------------------------------------------------------
   | Configure translation
   |--------------------------------------------------------------------------
   */
  .config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'assets/languages/',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
  })


/*
 |--------------------------------------------------------------------------
 | App Routes config
 |--------------------------------------------------------------------------
 */
angular.module('phainoUserApp')
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'GENERAL_CONFIG'
    , function ($stateProvider, $urlRouterProvider, $locationProvider, GENERAL_CONFIG) {
      // Redirect to 404 when route not found
      $urlRouterProvider.otherwise(function ($injector, $location) {
        $injector.get('$state').transitionTo('not-found', null, {
          location: false
        });
      });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      })

      // Now set up the states

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/views/home.html',
          controller: 'HomeController'
        })
        .state('not-found', {
          url: '/not-found',
          templateUrl: 'app/views/forRouteControl/404.html'
        })
        .state('forbidden', {
          url: '/forbidden',
          templateUrl: 'app/views/forRouteControl/403.html'
        });

    }]);
/*
 |--------------------------------------------------------------------------
 | App bootstraping
 |--------------------------------------------------------------------------
 */
angular.module('phainoUserApp')
  .run(function ($rootScope, $state, $location) {

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (fromState == '')
        $state.go(fromState.name);
      $state.transitionTo('home')
    });

  });
