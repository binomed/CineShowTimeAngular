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
      $scope.fav = false;


      $scope.goToHome = function(){
        $rootScope.$broadcast('openMenuEvt');
      }

      $scope.goToSearch = function(){
        $location.path('/main');        
      }

      $scope.goToFav = function(){
        $location.path('/fav');        
      }

      $scope.openMenu = function(){
        console.log('openMenu');
      }
    }
  };
  return directiveDefinitionObject;
}]);

 