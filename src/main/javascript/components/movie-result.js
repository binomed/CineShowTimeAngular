components.directive('movieResult', ['ModelFactory', '$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/movie-result.html',
    replace: true,
    restrict: 'E',
    scope: {        
        movie : '='
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.openMovie = function(){
        $location.path('movie');
      }
      
    }
  };
  return directiveDefinitionObject;
}]);

 