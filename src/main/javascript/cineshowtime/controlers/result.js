cst.controller('ResultCtrl',	
	['$rootScope', '$scope', '$http', 'ModelFactory',
	function($rootScope, $scope, $http, model) {

		$scope.results = [];


		$scope.showLoad = false;
		$scope.showError = false;
		$scope.showNoResults = false;
		var url =  model.getUrlNear();

		if (model.requestAsk){			
			$scope.showLoad = true;
			$scope.showNoResults = false;
			$http({
			    url: url,
			    method: "GET"
			}).success(function(data, status, headers, config) {
				$scope.showLoad = false;
				if (data){
					console.log(data);
					$scope.results = [];
					for(var thIdx = 0; thIdx < data.theaterList.length; thIdx++){
						var theater = data.theaterList[thIdx];
						var movieKeys = Object.keys(theater.movieMap);
						theater.showtimes = [];
						for(var shIdx =0; shIdx < movieKeys.length; shIdx++){
							var movieId = movieKeys[shIdx];
							var showtime = theater.movieMap[movieId];
							var movie = data.mapMovies[movieId];
							showtime.id = movieId;
							showtime.name = movie.movieName;
							theater.showtimes.push(showtime);
						}
						$scope.results.push(theater);
					}
					model.requestAsk = false;
				}
				$scope.showNoResults = $scope.results.length === 0;
			}).error(function(data, status, headers, config) {
				$scope.showLoad = false;
				$scope.showError = true;
				$scope.showNoResults = false;
			    console.log(data);
			});
		}

}]);