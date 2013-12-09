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
	var PATH_MOVIE = "/imdb?";

	/*
	* Model
	*/
	var request = {};
	var requestAsk = false;
	var results = {};
	var movieMap = {};
	var first = true;

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
		movie.load = true;
		movieMap[movie.id] = movie;
	}

	var getMovie = function(movieId){
		return movieMap[movieId];
	}

	/*
	* Use for mapping
	*/
	var mobile;

	/*
	* Urls Constructions
	*/

	var getUrlNear = function(){
		var baseUrl = PROTOCOL+HOST+PORT+PATH_NEAR;
		if (localMode){
			baseUrl = "http://localhost:80/search.json&";
		} 
		return baseUrl
			+"place="+encodeURIComponent(request.cityName)
			+"&day="+request.day
			+"&lang=fr"
			+"&curenttime="+(new Date().getTime())
			+"&timezone=GMT+1"
			+"&oe=UTF-8"
			+"&ie=UTF-8"
			+"&countryCode=FR"
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
			+"&lang=fr"
			+"&oe=UTF-8"
			+"&ie=UTF-8"
			+"&trailer=true"
			+"&output=json";
	} 

	/*
	* Utilities
	*/

	var getDays = function(){
		return [
			{value: 0, day:"Aujourd'hui", select : "selected"},
			{value: 1, day:"Demain", select : ""},
			{value: 2, day:"Mardi", select : ""},
			{value: 3, day:"Mercredi", select : ""},
			{value: 4, day:"Jeudi", select : ""},
			{value: 5, day:"Vendredi", select : ""},
			{value: 6, day:"Samedi", select : ""}
		]
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
		// Apis 
		getUrlNear : getUrlNear,
		getUrlMovie : getUrlMovie,
		getDays : getDays,

		first : first
	};
}]);