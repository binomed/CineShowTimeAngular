components.directive('movieTrailerList', ['ModelFactory', '$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/movie-trailer-list.html',
    replace: true,
    restrict: 'E',
    scope: {        
        movie : '='
    },    
    link: function postLink($scope, iElement, iAttrs) { 
      var sizeMovie = (screen.width / 3) + 30;
      sizeMovie = 120 + 30;

      $scope.$watch('movie', function(){
        if ($scope.movie.youtubeVideos){
          $(iElement.find('div')[0]).css('width', (sizeMovie * $scope.movie.youtubeVideos.length)+'px');
        }else{
          $(iElement.find('div')[0]).css('width', '100%');
        }
      }, true);

/*
      $rootScope.$on('showtimeListEvt', function(evt, showtimes){
        $scope.movieList = showtimes;
      });
*/
      
    }
  };
  return directiveDefinitionObject;
}]);

 