/**
 * Un module fonctionnel...
 */
var cst = angular.module('cst.main', ['cst.components'])
.run(['$rootScope', '$window', function($rootScope,$window){
    
	 // publish current transition direction on rootScope
  $rootScope.direction = '';
  // listen change start events
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (next.direction){
    	$rootScope.direction = next.direction;
    }else{
    	$rootScope.direction = 'rtl';
    	
    }

    // back
    $rootScope.back = function() {
      $window.history.back();
    }
  });
}]);

