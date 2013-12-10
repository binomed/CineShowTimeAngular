components.directive('movieResult', ['ModelFactory', 'ServicesFactory', '$rootScope','$location'
  ,function (model, services, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/movie-result.html',
    replace: true,
    restrict: 'E',
    scope: {        
        movie : '='
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.openMovie = function(){
        $location.path('movie').search({mid : $scope.movie.id});
      }
      
      $scope.hourFilter = function(showtime){
        return showtime.showtime > new Date().getTime();
      }

      $rootScope.$on('endLoadServiceMovieEvent', function(evt, movie){
        if ($scope.movie.id === movie.id){
          $scope.movie.imgSrc = movie.urlImg;
        }
      });

      
      if (model.first){

        var movieModel = model.getMovie($scope.movie.id);
        if (!movieModel.load){
          services.getMovie($scope.movie);
        }
        model.first = false;
      }
      

    }
  };
  return directiveDefinitionObject;
}]);

 