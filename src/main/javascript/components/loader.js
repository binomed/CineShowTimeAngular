components.directive('loader', ['$rootScope'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/loader.html',
    replace: true,
    restrict: 'E',
    scope: {       
       
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      
    }
  };
  return directiveDefinitionObject;
}]);

 