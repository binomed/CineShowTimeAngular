components.directive('actionBar', ['ModelFactory', '$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/action-bar.html',
    replace: true,
    restrict: 'E',
    scope: {        
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.search = false;
      $scope.fav = true;

      $scope.goToHome = function(){
        $location.path('/main');
      }

      $scope.goToSearch = function(){

      }

      $scope.goToFav = function(){
        
      }
    }
  };
  return directiveDefinitionObject;
}]);

 