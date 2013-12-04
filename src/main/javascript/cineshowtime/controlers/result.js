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

			console.log('Call to url : '+url);

			console.log('Call with Angular.');
			$http({
			    url: url,
			    method: "GET"
			}).success(function(data, status, headers, config) {
				$scope.showLoad = false;
				console.log('Sucess with Angular : '+data);
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
				console.log('Error with Angular : '+data);
				$scope.showLoad = false;
				$scope.showError = true;
				$scope.showNoResults = false;
			});


			console.log('Call with getJSON.');
			$.getJSON(url,
				function(data, status, headers, config) {
				$scope.showLoad = false;
				console.log('Sucess with getJSON : '+data);
			}).fail(function(jqXHR, textStatus, error) {
				$scope.showLoad = false;
				$scope.showError = true;
				$scope.showNoResults = false;
				console.log('Error with getJSON : '+error);
			    console.log(error);
			});

			
			console.log('Simple getJSON.');
			$.getJSON('http://echo.jsontest.com/test/value', 
				function(data, textStatus, jqXHR){
				console.log('Sucess : '+data);
			}).fail(function(jqXHR, textStatus, error){
				console.log('Error : '+error);
			});

			console.log('Simple angularGet.');
			$http({
			    url: 'http://echo.jsontest.com/test/value',
			    method: "GET"
			}).success(function(data, status, headers, config) {
				console.log('Sucess with SimpleAngular : '+data);				
			}).error(function(data, status, headers, config) {
				console.log('Error with SimpleAngular : '+data);				
			});

		}

}]);