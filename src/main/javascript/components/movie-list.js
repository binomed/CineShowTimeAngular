components.directive('movieList', ['ModelFactory', '$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/movie-list.html',
    replace: true,
    restrict: 'E',
    scope: {        
        movieList : '&'
    },    
    link: function postLink($scope, iElement, iAttrs) { 
      var sizeMovie = (screen.width / 3) + 30;
      sizeMovie = 120 + 30;

      $scope.$watch('movieList', function(){
        if ($scope.movieList){
          $(iElement.find('div')[0]).css('width', (sizeMovie * $scope.movieList.length)+'px');
        }else{
          $(iElement.find('div')[0]).css('width', '100%');
        }
      });

      $rootScope.$on('showtimeListEvt', function(evt, showtimes){
        $scope.movieList = showtimes;
      });

      
    }
  };
  return directiveDefinitionObject;
}]);

 