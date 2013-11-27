cst.controller('CstCtrl',	
	['$rootScope', '$scope', '$http', 'ModelFactory',
	function($rootScope, $scope, $http, model) {

		console.log('Hello Main App ?')

		$scope.fav = true;
		$scope.search = false;

}]);