/**
 * Created by Zakaria on 20/04/2017.
 */
angular.module('phainoUserApp')
  .controller('CreateUserController', ['$http', '$rootScope', '$scope', 'siteUrl', '$state', 'toastr', '$timeout', 'Upload',
    function ($http, $rootScope, $scope, siteUrl, $state, toastr, $timeout, Upload) {

      $scope.submitted = false;
      $scope.user = {};
      $scope.user.picture;// = 'http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image';
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
      /*
       * detect if user interacted with the field
       */
      $scope.interacted = function (field) {
        return $scope.submitted || field.$dirty;
      };
      /*
       * Submit form info when clicking on validation button
       */
      $scope.submitUserForm = function () {
        // start loading
        $scope.saveUserLoading = true;
        $scope.submitted = true;
        if ($scope.userForm.$valid) {
          $timeout(function () {
            $scope.upload($scope.user, function (err, resp) {
              if (err) {
                toastr.error(resp.data.message)
              } else if (resp.status == 201) {
                $state.go('home', null, {reload: true});
                toastr.success('Un utilisateur a été enregistré!')
              }
              else {
                toastr.error(resp.data.message)
              }
              $scope.saveUserLoading = false;
            });
          });
        }
        else {
          $scope.saveUserLoading = false;
        }
      };

      /*
       * upload the selected picture with form data after validation
       */
      $scope.upload = function (user, callback) {
        Upload.upload({
          url: siteUrl.apiUrl + 'users/',
          data: user,
          file: [[user.picture]]
        }).then(function (resp) {
          // console.log(resp.status + ' Success : files uploaded. Response: ' + resp.data);
          callback(null, resp);
        }, function (resp) {
          // console.error('Error status: ' + resp.status);
          callback(resp.data.message, resp);
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          // console.log('progress: ' + progressPercentage + '% ');
        });

        $timeout(function () {
          if ($scope.saveUserLoading) {
            toastr.error("Le délai d'attente a été atteint");
            $scope.saveUserLoading = false;
          }
        }, 4000);
      };
    }]);