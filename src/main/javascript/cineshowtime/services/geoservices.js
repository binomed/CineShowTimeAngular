cst.factory('GeoServicesFactory',['$rootScope', '$http', 'ModelFactory',function($rootScope, $http, model){

	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	var URL_PREFIX_SEARCH = "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&addressdetails=1&limit=1&q=";
	var URL_PREFIX_REVERSE = "http://open.mapquestapi.com/nominatim/v1/reverse.php?format=json&";

	function geoSearch(address, callback){

		var url = URL_PREFIX_SEARCH+encodeURIComponent(address)

		$http({
		    url: url,
		    method: "GET"
		}).success(function(data, status, headers, config) {
			//var json = JSON.parse(data);
			console.log('Sucess with Angular for request Address : ');
			console.log(data);
			callback(data && data.length > 0 ? data[0] : null);
			
		}).error(function(data, status, headers, config) {
			console.log('Error with Angular : '+data);
			
		});
	}

	function reverseGeoLoc(latitude, longitude, callback){

		var url = URL_PREFIX_REVERSE+
			"lat="+latitude+
			"&lon="+longitude;

		$http({
		    url: url,
		    method: "GET"
		}).success(function(data, status, headers, config) {
			console.log('Sucess with Angular for reverse geoloc : ');
			console.log(data);
			callback(data);
			
		}).error(function(data, status, headers, config) {
			console.log('Error with Angular : '+data);
			
		});
	}

	return{
		//Apis
		geoSearch : geoSearch,
		reverseGeoLoc : reverseGeoLoc
	};
}]);