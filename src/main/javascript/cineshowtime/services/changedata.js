cst.factory('ChangeDataFactory',['$rootScope', 'ModelFactory',function($rootScope, model){

	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	function filterShowtimes(results){
		var now = new Date().getTime();
		for (var i = 0; i < results.length; i++){
			var theater = results[i];
			for (var j = 0; j < theater.showtimes.length; j++){
				var movie = theater.showtimes[j];
				movie.noMoreShowTimes = true;
				for (var k = 0; k < movie.length; k++){
					var	showtime = movie[k];
					if (!showtime.passed && showtime.showtime < now){
						showtime.passed = true;
					}else if (!showtime.passed){
						movie.noMoreShowTimes = false;
					}
				}
			}
		}
		return results;
	}

	
	return{
		//Apis
		filterShowtimes : filterShowtimes
	};
}]);