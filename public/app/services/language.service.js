/**
 * Created by Zakaria on 21/04/2017.
 */
angular.module('phainoUserApp')

  .service('language', function ($http) {
    this.getTranslation=function (lang) {
      $http.get('../../assets/languages/'+lang+'.json')
        .then(function(res){
          return res.data;
        });
    }
  });
