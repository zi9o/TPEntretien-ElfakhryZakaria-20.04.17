/**
 * Created by Zakaria on 20/04/2017.
 */
angular.module('phainoUserApp')

  .service('siteUrl', function ($location) {
    this.baseUrl =$location.protocol()+'://'+location.host;
    this.apiUrl=$location.protocol()+'://'+location.host +'/api'+'/';
  });