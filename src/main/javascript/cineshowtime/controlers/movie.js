cst.controller('MovieCtrl',	
	['$rootScope', '$scope', '$http', '$location', 'ModelFactory', 'ServicesFactory',
	function($rootScope, $scope, $http, $location, model, services) {

		$scope.movieId = null;
		$scope.movie = null;
		$scope.showtimes = [];

		$scope.activePane1 = 'active';
		$scope.activePane2 = '';
		$scope.activePane3 = '';
		$scope.theater = {};
			
		if ($location.search().mid){
			$scope.movieId = $location.search().mid;

			$scope.movie = model.getMovie($scope.movieId);
			if (!$scope.movie){
				$location.path('/main').search({});
				return;
			}
			var results = model.getResults();
			var currentTheaterId = model.getCurrentTheater();
			for (var i =0; i < results.length; i++){
				var theater = results[i];
				if (theater.id === currentTheaterId){
					$scope.theater = theater;
					$scope.showtimes = theater.movieMap[$scope.movieId];
					break;
				}
			}
		}else{
			$location.path('/main');
		}

		function updateIndex(index){
			$scope.activePane1 = index === 0 ? 'active' : '';
			$scope.activePane2 = index === 1 ? 'active' : '';
			$scope.activePane3 = index === 2 ? 'active' : '';
		}

		$scope.paneActive = function(index){
			$rootScope.$emit('newPaneClick', index);
			updateIndex(index);
		}


		$rootScope.$on('newPaneIndex', function(evt, index){
			$scope.$apply(function(){
				updateIndex(index);
			});
		});
		

}]);