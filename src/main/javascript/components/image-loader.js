components.directive('imageLoader', ['ModelFactory', '$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/image-loader.html',
    replace: true,
    restrict: 'E',
    scope: {        
      classType : '@',
      urlSrc : '=urlSrc'
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.imgLoad = false;
      var img = iElement.find('img')[1];
      
      $scope.$watch('urlSrc', function(newValue){
        if (newValue && newValue != ''){
          preloadImg(newValue, function(){
            $scope.$apply(function(){
              $scope.imgLoad = true;
            });
          });
        }
      });


      function preloadImg(url, callback){
        img.onload = function(){
          callback();
        };


        img.onerror = function(e){
          console.log('Error loading image : '+url+'; error : '+e);
          img.src = '../assets/images/NoPosterAvailable.jpg';
        }

        img.src = url;
        
      }

    }
  };
  return directiveDefinitionObject;
}]);

 