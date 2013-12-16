cst.factory('ModelFactory',['$rootScope', '$http',function($rootScope, $http){

	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	/*
	* Constants
	*/
	var localMode = false;
	var HOST = "11.binomed-andshowtime-project-1.appspot.com";
	var PROTOCOL = "http://";
	var PORT = ":80";
	var PATH_NEAR = "/showtime/near?";
	var PATH_NEAR_MOVIE = "/showtime/movie?";
	var PATH_MOVIE = "/imdb?";

	/*
	* Model
	*/
	var request = {};
	var requestAsk = false;
	var results = {};
	var movieMap = {};
	var first = true;
	var currentTheaterId = null;
	var currentResult = null;

	var setRequest = function(requestToSet){
		request = requestToSet;
	}

	var getRequest = function(){
		return request;
	}

	var setResults = function(resultsToSet){
		results = resultsToSet;
	}

	var getResults = function(){
		return results;
	}

	var setMovies = function(movies){
		movieMap = movies;
	}

	var updateMovie = function(movie){
		var oldMovie = movieMap[movie.id];
		movie.load = true;
		movie.movieTime = oldMovie.movieTime;
		movieMap[movie.id] = movie;
	}

	var getMovie = function(movieId){
		return movieMap[movieId];
	}

	var setCurrentTheater = function(theaterId){
		currentTheaterId = theaterId;
	}

	var getCurrentTheater = function(){
		return currentTheaterId;
	}

	var setResults = function(results){
		currentResult = results;
	}

	var getResults = function(){
		return currentResult;
	}


	/*
	* Use for mapping
	*/
	var mobile;

	/*
	* Urls Constructions
	*/

	var getUrlNear = function(){
		var movieRequest = request.movieName && request.movieName != '' && request.movieName.trim() != '';
		var baseUrl = PROTOCOL+HOST+PORT 
			+(movieRequest ? PATH_NEAR_MOVIE : PATH_NEAR);
		if (localMode){
			baseUrl = "http://localhost:80/search.json&";
		} 
		return baseUrl
			+"place="+encodeURIComponent(request.cityName)
			+(movieRequest ? '&moviename='+encodeURIComponent(request.movieName) : '')
			+"&day="+request.day
			+"&lang="+navigator.language
			+"&curenttime="+(new Date().getTime())
			+"&timezone=GMT+1"
			+"&oe=UTF-8"
			+"&ie=UTF-8"
			+"&countryCode="+navigator.language
			+"&output=json";
	} 

	var getUrlMovie = function(mid){
		var baseUrl = PROTOCOL+HOST+PORT+PATH_MOVIE;
		if (localMode){
			baseUrl = "http://localhost:80/search.json&";
		} 
		return baseUrl
			+"place="+encodeURIComponent(request.cityName)
			+"&mid="+mid
			+"&moviename="+movieMap[mid].englishMovieName
			+"&moviecurlangname="+movieMap[mid].movieName
			+"&lang="+navigator.language
			+"&oe=UTF-8"
			+"&ie=UTF-8"
			+"&trailer=true"
			+"&output=json";
	} 

	/*
	* Utilities
	*/

	var getDays = function(){

		var today = new Date().getDay();
		var days = [
			{value: 0, day:"Today", select : "selected"},
			{value: 1, day:"Tomorow", select : ""}
		]
		if (today === 0){
			// TODAY = Sunday
			days.push({value : 2, day : "Tuesday", select : ""});
			days.push({value : 3, day : "Wednesday", select : ""});
			days.push({value : 4, day : "Thursday", select : ""});
			days.push({value : 5, day : "Friday", select : ""});
			days.push({value : 6, day : "Saturday", select : ""});
		}else if (today === 1){
			// TODAY = Monday
			days.push({value : 2, day : "Wednesday", select : ""});
			days.push({value : 3, day : "Thursday", select : ""});
			days.push({value : 4, day : "Friday", select : ""});
			days.push({value : 5, day : "Saturday", select : ""});
			days.push({value : 6, day : "Sunday", select : ""});
		}else if (today === 2){
			// TODAY = Tuesday
			days.push({value : 2, day : "Thursday", select : ""});
			days.push({value : 3, day : "Friday", select : ""});
			days.push({value : 4, day : "Saturday", select : ""});
			days.push({value : 5, day : "Sunday", select : ""});
			days.push({value : 6, day : "Monday", select : ""});
		}else if (today === 3){
			// TODAY = Wednesday
			days.push({value : 2, day : "Friday", select : ""});
			days.push({value : 3, day : "Saturday", select : ""});
			days.push({value : 4, day : "Sunday", select : ""});
			days.push({value : 5, day : "Monday", select : ""});
			days.push({value : 6, day : "Tuesday", select : ""});
		}else if (today === 4){
			// TODAY = Thursday
			days.push({value : 2, day : "Saturday", select : ""});
			days.push({value : 3, day : "Sunday", select : ""});
			days.push({value : 4, day : "Monday", select : ""});
			days.push({value : 5, day : "Tuesday", select : ""});
			days.push({value : 6, day : "Wednesday", select : ""});
		}else if (today === 5){
			// TODAY = Friday
			days.push({value : 2, day : "Sunday", select : ""});
			days.push({value : 3, day : "Monday", select : ""});
			days.push({value : 4, day : "Tuesday", select : ""});
			days.push({value : 5, day : "Wednesday", select : ""});
			days.push({value : 6, day : "Thursday", select : ""});
		}else if (today === 6){
			// TODAY = Saturday
			days.push({value : 2, day : "Monday", select : ""});
			days.push({value : 3, day : "Tuesday", select : ""});
			days.push({value : 4, day : "Wednesday", select : ""});
			days.push({value : 5, day : "Thursday", select : ""});
			days.push({value : 6, day : "Friday", select : ""});
		}

		return days
	}

	return{
		//Model
		mobile : mobile,
		setRequest : setRequest,
		getRequest : getRequest,
		requestAsk : requestAsk,
		setResults : setResults,
		getResults : getResults,
		setMovies : setMovies,
		getMovie : getMovie,
		updateMovie : updateMovie,
		setCurrentTheater : setCurrentTheater,
		getCurrentTheater : getCurrentTheater,
		setResults : setResults,
		getResults : getResults,
		// Apis 
		getUrlNear : getUrlNear,
		getUrlMovie : getUrlMovie,
		getDays : getDays,

		first : first
	};
}]);