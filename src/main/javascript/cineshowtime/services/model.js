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

	/*
	* Model
	*/
	var request = {};
	var requestAsk = false;
	var results = {};

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
			+"place="+request.cityName
			+"&day="+request.day
			+"&lang=fr"
			+"&curenttime="+(new Date().getTime())
			+"&timezone=GMT+1"
			+"&oe=UTF-8"
			+"&ie=UTF-8"
			+"&countryCode=FR"
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
		// Apis 
		getUrlNear : getUrlNear,
		getDays : getDays
	};
}]);