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
    $translateProvider.translations('en', {
      LANG: "Language",
      PAGE_404: "Not found",
      Home:'Home',
      USER_LIST:"List of users",
      SETTINGS:"Settings",
      SEARCH:"Search",
      ADD_NEW:"Add New",
      REFRESH:"Refresh",
      TOOLS:"Tools",
      ADD: "Add",
      EMAIL: "Email",
      CREATE: "Create",
      SAVE:"Save",
      FULLNAME: "Full name",
      FIRSTNAME: "First name",
      LASTNAME: "Last name",
      ADDRESS:"Address",
      CITY:"City",
      COUNTRY:"Country",
      PICTURE:"Picture",
      SELECT_PICTURE:"Select an image",
      CHANGE:"Change",
      REMOVE:"Remove",
      FIRSTNAME_REQUIRED:"First name is required",
      LASTNAME_REQUIRED:"Last name is required",
      ADDRESS_REQUIRED:"Address is required",
      CITY_REQUIRED:"City is required",
      COUNTRY_REQUIRED:"Country is required",
      PICTURE_REQUIRED:"Picture is required",
      BUTTON_LANG_EN: 'english',
      BUTTON_LANG_FR: 'french'
    });
    $translateProvider.translations('fr', {
      LANG: "Langage",
      PAGE_404: "Page introuvable",
      Home:'Accueil',
      USER_LIST:"Liste des utilisateurs",
      SETTINGS:"Paramètres",
      SEARCH:"Chercher",
      ADD_NEW:"Ajouter Nouveau",
      REFRESH:"Actualiser",
      TOOLS:"Outils",
      ADD: "Ajouter",
      EMAIL: "Email",
      CREATE: "Créer",
      SAVE:"Sauvegarder",
      FULLNAME: "Nom complet",
      FIRSTNAME: "Prénom",
      LASTNAME: "Nom",
      ADDRESS:"Adresse",
      CITY:"Ville",
      COUNTRY:"Pays",
      PICTURE:"Photo",
      SELECT_PICTURE:"Sélectionner une image",
      CHANGE:"Changer",
      REMOVE:"Enlever",
      FIRSTNAME_REQUIRED:"Le prénom est obligatoire.",
      LASTNAME_REQUIRED:"Le nom est obligatoire.",
      ADDRESS_REQUIRED:"L'adresse est obligatoire.",
      CITY_REQUIRED:"La ville est obligatoire.",
      COUNTRY_REQUIRED:"Le pays est obligatoire.",
      PICTURE_REQUIRED:"La photo est obligatoire",
      BUTTON_LANG_EN: 'anglais',
      BUTTON_LANG_FR: 'français'
    });
    $translateProvider.preferredLanguage('en');
  });


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