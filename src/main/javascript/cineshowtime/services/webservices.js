cst.factory('ServicesFactory',['$rootScope', '$http', 'ModelFactory',function($rootScope, $http, model){

	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	function nearService(){
		$http({
		    url: model.getUrlNear(),
		    method: "GET"
		}).success(function(data, status, headers, config) {
			console.log('Sucess with Angular for showtimes : '+data);
			var results = [];
			if (data){
				for(var thIdx = 0; thIdx < data.theaterList.length; thIdx++){
					var theater = data.theaterList[thIdx];
					var movieKeys = Object.keys(theater.movieMap);
					theater.showtimes = [];
					for(var shIdx =0; shIdx < movieKeys.length; shIdx++){
						var movieId = movieKeys[shIdx];
						var showtime = theater.movieMap[movieId];
						var movie = data.mapMovies[movieId];
						showtime.id = movieId;
						showtime.name = decodeURIComponent(movie.movieName).split('+').join(' ');
						showtime.imgSrc = '../assets/images/loading_preview.png';
						theater.showtimes.push(showtime);
					}
					results.push(theater);
				}
				model.setMovies(data.mapMovies);
				model.requestAsk = false;
			}
			model.setResults(results);
			$rootScope.$broadcast('endLoadServiceEvent', results);
		}).error(function(data, status, headers, config) {
			$rootScope.$broadcast('errorLoadServiceEvent', data);
			console.log('Error with Angular : '+data);
			
		});
	}

	function getMovie(movie){
		$http({
		    url: model.getUrlMovie(movie.id),
		    method: "GET"
		}).success(function(data, status, headers, config) {
			console.log('Sucess with Angular for movie : '+data);
			model.updateMovie(data);
			$rootScope.$broadcast('endLoadServiceMovieEvent', data);
		}).error(function(data, status, headers, config) {
			$rootScope.$broadcast('errorLoadServiceMovieEvent', data);
			console.log('Error with Angular : '+data);
			
		});
	}

	return{
		//Apis
		nearService : nearService,
		getMovie : getMovie
	};
}]);