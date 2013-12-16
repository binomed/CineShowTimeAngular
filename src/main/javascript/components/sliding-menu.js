components.directive('slidingMenu', ['ModelFactory', '$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/sliding-menu.html',
    replace: true,
    restrict: 'E',
    scope: {        
      hide : '&'
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.hide = true;
      $scope.classType = 'away';

      $rootScope.$on('openMenuEvt', function(){
        $scope.hide = false;
        $scope.classType = '';
      });

      $scope.close = function(){
        $scope.hide = true;
        $scope.classType = 'away';
      }

      $scope.about = function(){
        $scope.hide = true;
        $scope.classType = 'away';
        $('#myModal').modal('show'); 
      }
      
    }
  };
  return directiveDefinitionObject;
}]);

 