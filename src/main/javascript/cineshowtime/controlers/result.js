cst.controller('ResultCtrl',	
	['$rootScope', '$scope', '$http', 'ModelFactory', 'ServicesFactory',
	function($rootScope, $scope, $http, model, services) {

		$scope.results = [];
		$scope.showtimeList = [];


		$scope.showLoad = false;
		$scope.showError = false;
		$scope.showNoResults = true;





		$rootScope.$on('proceedRequestEvt', function(){
			if (model.requestAsk){			
				services.nearService();			

				$scope.showLoad = true;
				$scope.showNoResults = false;
			}
		});

		$rootScope.$on('endLoadServiceEvent', function(evt, results){			
			$scope.results = results;
			$scope.showLoad = false;
			$scope.showNoResults = $scope.results.length === 0;
			if ($scope.results.length > 0){
				var theater = $scope.results[0];
				$scope.showtimeList = theater.showtimes;

			}
		});

		$rootScope.$on('errorLoadServiceEvent', function(evt, error){
			$scope.showLoad = false;
			$scope.showError = true;
			$scope.showNoResults = false;
		});


		

}]);