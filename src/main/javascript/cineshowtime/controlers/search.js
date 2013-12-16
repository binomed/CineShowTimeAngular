cst.controller('SearchCtrl',	
	['$rootScope', '$scope', '$http', '$location' , 'ModelFactory', 'ServicesFactory', 'GeoServicesFactory',
	function($rootScope, $scope, $http, $location, model, services, geoservices) {

		$scope.cityName = '';
		$scope.movieName = '';
		$scope.days = model.getDays();
		$scope.dayPicker = 0;
		$scope.visibilityMovie = '';
		$scope.visibilityCityName = 'show-city-name';
		$scope.showBtnSearchExpand = false;
		$scope.validCityClass = '';
		$scope.validMovieClass =  '';
		$scope.errorText = '';
		$scope.showError = false;	
		$scope.unlocateTheater = [];
		$scope.showUnlocateTheater = false;
		$scope.showUnlocateTheaterList = false;

		/*
		* Scope Methods
		*/

		//http://blog.revolunet.com/angular-for-mobile/#1

		$scope.search = function(){

			if ($scope.cityName.length === 0 && $scope.movieName.length ===0){
				$scope.validCityClass = 'has-error';
				$scope.validMovieClass = 'has-error';
				$scope.errorText = 'Vous devez remplir au minumum une ville de recherche';
				$scope.showError = true;
				return;
			}else if ($scope.cityName.length === 0 && $scope.movieName.length !=0){
				$scope.validCityClass = 'has-error';
				$scope.validMovieClass = '';
				$scope.errorText = 'Vous devez remplir une ville';
				$scope.showError = true;
				return;
			}

			$scope.validCityClass = '';
			$scope.validMovieClass = '';
			$scope.errorText = '';
			$scope.showError = false;

			model.setRequest({
				cityName : $scope.cityName,
				movieName : $scope.movieName,
				day : $scope.dayPicker
			});
			model.requestAsk = true;
			$scope.unlocateTheater = [];
			$scope.showUnlocateTheater = false;
			$scope.showUnlocateTheaterList = false;
			$rootScope.$emit('proceedRequestEvt');		

			$scope.showBtnSearchExpand = true;	
			$scope.visibilityMovie = '';
			$scope.visibilityCityName = '';
		}

		$scope.expandSearch = function(){
			$scope.showBtnSearchExpand = false;	
			$scope.visibilityMovie = model.getRequest().movieName != '' ? 'show-movie-name' : '';
			$scope.visibilityCityName = 'show-city-name';	
		}

		$scope.gpsSearch = function(){
			navigator.geolocation.getCurrentPosition(function(position) {
				if (typeof google === 'object' && typeof google.maps === 'object'){					
					var geocoder = new google.maps.Geocoder();
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					geocoder.geocode({'latLng': latlng}, function(results, status) {
					    if (status == google.maps.GeocoderStatus.OK) {
					      if (results[1]) {
					      	$scope.$apply(function(){
						      	$scope.cityName = results[1].formatted_address;
						    });
					        /*map.setZoom(11);
					        marker = new google.maps.Marker({
					            position: latlng,
					            map: map
					        });
					        infowindow.setContent(results[1].formatted_address);
					        infowindow.open(map, marker);*/
					      } else {
					        alert('No results found');
					      }
					    } else {
					      alert('Geocoder failed due to: ' + status);
					    }
					});					
				}else{
					geoservices.reverseGeoLoc(position.coords.latitude, position.coords.longitude, function(results){
						if (results && results.address){			
							if (results.address.road){
						    	$scope.cityName = results.address.road+", "+results.address.city;
							}else if (results.address.pedestrian){
								$scope.cityName = results.address.pedestrian+", "+results.address.city;
							}else if (results.address.neighbourhood){
								$scope.cityName = results.address.neighbourhood+", "+results.address.city;
							}else{
								$scope.cityName = results.address.city;
							}				
						}
					});
				}
				$scope.$apply(function(){
					$scope.map = { center: {lat: position.coords.latitude, lng: position.coords.longitude}, zoom: 12 };
				});
	          	console.log(position.coords.latitude + " " + position.coords.longitude);
	          
	          //document.getElementById('info').innerHTML = "";
	      }, function(position) {
	          alert("Failed to get your current location");
	      });
		}

		$scope.keyUp = function(event){
			if (event.keyCode === 13){
				$scope.search();
			}
		}

		$scope.openUnlocateTheaters = function(){
			$scope.showUnlocateTheaterList = true;
		}

		$scope.hideTheaterUnlocated = function(){
			$scope.showUnlocateTheaterList = false;
		}

		$scope.openTheater = function(theater){
			$scope.showUnlocateTheaterList = false;
			$rootScope.$emit('clickTheaterEvt', theater.id);
		}

		$scope.map = { center: {lat: 47.211, lng: -1.566}, zoom: 12 };


		/*
		Listeners
		*/

		$scope.$watch('cityName', function(){
			$scope.visibilityMovie = ($scope.cityName != null && $scope.cityName.length > 0) ? 'show-movie-name' : '';
		});

		$scope.$watch('unlocateTheater', function(){
			$scope.showUnlocateTheater = $scope.unlocateTheater.length > 0;
		},true);

}]);