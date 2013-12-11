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
					theater.theaterName = decodeURIComponent(theater.theaterName).split('+').join(' '); 
					var movieKeys = Object.keys(theater.movieMap);
					theater.showtimes = [];
					for(var shIdx =0; shIdx < movieKeys.length; shIdx++){
						var movieId = movieKeys[shIdx];
						var showtime = theater.movieMap[movieId];
						var movie = data.mapMovies[movieId];
						showtime.id = movieId;
						if (!movie.decode){							
							movie.movieName = decodeURIComponent(movie.movieName).split('+').join(' ');
							movie.englishMovieName = decodeURIComponent(movie.englishMovieName).split('+').join(' ');
							movie.decode = true;
						}
						showtime.name = movie.movieName;
						showtime.imgSrc = '../assets/images/loading_preview.png';
						theater.showtimes.push(showtime);
					}
					results.push(theater);
				}
				model.setResults(results);
				model.setMovies(data.mapMovies);
				model.requestAsk = false;
			}
			model.setResults(results);
			$rootScope.$emit('endLoadServiceEvent', results);
		}).error(function(data, status, headers, config) {
			$rootScope.$emit('errorLoadServiceEvent', data);
			console.log('Error with Angular : '+data);
			
		});
	}

	function getMovie(movie){
		$http({
		    url: model.getUrlMovie(movie.id),
		    method: "GET"
		}).success(function(data, status, headers, config) {
			console.log('Sucess with Angular for movie : '+data);
			data.movieName = decodeURIComponent(data.movieName).split('+').join(' ');
			data.englishMovieName = decodeURIComponent(data.englishMovieName).split('+').join(' ');
			data.description = decodeURIComponent(data.description).split('+').join(' ');
			data.actorList = decodeURIComponent(data.actorList).split('+').join(' ').split('|');
			data.directorList = decodeURIComponent(data.directorList).split('+').join(' ').split('|');
			if (data.youtubeVideos){
				for (var i =0; i < data.youtubeVideos.length; i++){
					data.youtubeVideos[i].videoName = decodeURIComponent(data.youtubeVideos[i].videoName).split('+').join(' ');
				}
			}
			model.updateMovie(data);
			$rootScope.$emit('endLoadServiceMovieEvent', data);
		}).error(function(data, status, headers, config) {
			$rootScope.$emit('errorLoadServiceMovieEvent', data);
			console.log('Error with Angular : '+data);
			
		});
	}

	return{
		//Apis
		nearService : nearService,
		getMovie : getMovie
	};
}]);