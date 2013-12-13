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

      $scope.imgLoad = false;
      $scope.urlToLoad = '';//{url : ''};
      //$scope.urlToLoad = null;

      var imgLoad = iElement.find('img')[1];

      $scope.openMovie = function(){
        $location.path('movie').search({mid : $scope.movie.id});
      }
      
      $scope.hourFilter = function(showtime){
        return !showtime.passed;
        //return showtime.showtime > new Date().getTime();
      }

      $rootScope.$on('endLoadServiceMovieEvent', function(evt, movie){
        if ($scope.movie.id === movie.id){
          $scope.movie.imgSrc = movie.urlImg;
          //$scope.urlToLoad.url = movie.urlImg;
          $scope.urlToLoad = movie.urlImg;
          //$scope.urlToLoad = {url : movie.urlImg};
          /*
          preloadImg(movie.urlImg, function(){
            $scope.$apply(function(){
              $scope.imgLoad = true;
            });
          })*/
        }
      });

      function preloadImg(url, callback){
        imgLoad.onload = function(){
          callback();
        };


        imgLoad.onerror = function(e){
          console.log('Error loading image : '+url+'; error : '+e);
          imgLoad.src = '../assets/images/NoPosterAvailable.jpg';
        }

        imgLoad.src = url;
        
      }

      
      //if (model.first){

        var movieModel = model.getMovie($scope.movie.id);
        if (!movieModel.load){
          services.getMovie($scope.movie);
        }
        model.first = false;
      //}
      

    }
  };
  return directiveDefinitionObject;
}]);

 