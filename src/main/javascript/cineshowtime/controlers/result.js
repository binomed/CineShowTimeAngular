cst.controller('ResultCtrl',	
	['$rootScope', '$scope', '$http', 'ModelFactory',
	function($rootScope, $scope, $http, model) {

		$scope.results = [
			{
				id : 1,
				title: 'Test1',
				showtimes : [
					{
						title : 'showtime 1.1'
					},
					{
						title : 'showtime 1.2'
					}
				]
			},
			{
				id : 2,
				title: 'Test2',
				showtimes : [
					{
						title : 'showtime 2.1'
					},
					{
						title : 'showtime 2.2'
					}
				]
			}
		];


		$scope.showLoad = true;
		$scope.showNoResults = $scope.results.length === 0;

		//delete $http.defaults.headers.common['X-Requested-With'];

		var url =  "http://10.binomed-andshowtime-project-1.appspot.com/"
				+"/showtime/near?place=nantes&day=0&lang=fr"
				+"&curenttime="+(new Date().getTime())
				+"&timezone=GMT+1"
				+"&oe=UTF-8&ie=UTF-8&countryCode=FR&output=json";
				

				$.getJSON(url, function(data, status, xhr){
					if (data){
						console.log(data);
					}
				})
				.fail(function(xhr, status, error){
					console.log(error);
				});

/*
		$http({
		    url: url,
		    method: "GET"
		}).success(function(data, status, headers, config) {
			if (data){

			}
		}).error(function(data, status, headers, config) {
		    console.log(data);
		});*/

}]);