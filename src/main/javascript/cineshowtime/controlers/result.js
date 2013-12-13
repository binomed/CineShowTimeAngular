cst.controller('ResultCtrl',	
	['$rootScope', '$scope', '$timeout', 'ModelFactory', 'ServicesFactory', 'ChangeDataFactory',
	function($rootScope, $scope, $timeout, model, services, changeData) {

		$scope.results = [];
		$scope.showtimeList = [];

		$scope.showLoad = false;
		$scope.showError = false;
		$scope.showNoResults = true;
		$scope.showResults = true;

		function loadResults(results){
			$scope.results = changeData.filterShowtimes(results);
			$scope.showLoad = false;
			$scope.showNoResults = $scope.results.length === 0;
			$scope.showResults = !$scope.showNoResults;
			if ($scope.results.length > 0){
				var theater = $scope.results[0];
				model.setCurrentTheater(theater.id);
				$scope.showtimeList = theater.showtimes;
				$rootScope.$emit('showtimeListEvt', theater.showtimes);
			}
		}

		if (model.getResults() && model.getResults().length > 0){
			// We load previous results
			$scope.showLoad = true;
			$scope.showError = false;
			$scope.showNoResults = false;
			$scope.showResults = false;

			$timeout(function(){
				$rootScope.$emit('endLoadServiceEvent', model.getResults());
				//loadResults(model.getResults());
			}, 1000);
			
		}


		$rootScope.$on('proceedRequestEvt', function(){
			if (model.requestAsk){			
				services.nearService();			

				$scope.showLoad = true;
				$scope.showNoResults = false;
				$scope.showResults = false;
			}
		});


		$rootScope.$on('endLoadServiceEvent', function(evt, results){			
			loadResults(results);
		});

		$rootScope.$on('errorLoadServiceEvent', function(evt, error){
			$scope.showLoad = false;
			$scope.showError = true;
			$scope.showNoResults = false;
			$scope.showResults = false;
		});

		$rootScope.$on('clickTheaterEvt', function(evt, theaterId){
			$scope.showLoad = true;
			$scope.showError = false;
			$scope.showNoResults = false;
			$scope.showResults = false;
			$scope.showtimeList = [];
			for (var i = 0; i < $scope.results.length; i++){
				var theater = $scope.results[i];
				if (theater.id === theaterId){
					model.setCurrentTheater(theater.id);
					$scope.showtimeList = theater.showtimes;
					break;
					//$rootScope.$emit('showtimeListEvt', theater.showtimes);
				}
			}
			$scope.showLoad = false;
			$scope.showError = false;
			$scope.showNoResults = false;
			$scope.showResults = true;
		});

}]);