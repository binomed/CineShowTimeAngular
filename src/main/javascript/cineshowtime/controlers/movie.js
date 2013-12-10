cst.controller('MovieCtrl',	
	['$rootScope', '$scope', '$http', '$location', 'ModelFactory', 'ServicesFactory',
	function($rootScope, $scope, $http, $location, model, services) {

		$scope.movieId = null;
			
		if ($location.search().mid){
			$scope.movieId = $location.search().mid;
		}

		

}]);