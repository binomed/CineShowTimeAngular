cst.controller('CstCtrl',	
	['$rootScope', '$scope', '$http', '$location' , 'ModelFactory',
	function($rootScope, $scope, $http, $location, model) {

		$scope.cityName = '';
		$scope.movieName = '';
		$scope.days = model.getDays();
		$scope.dayPicker = 0;
		$scope.validCityClass = '';
		$scope.validMovieClass =  '';
		$scope.errorText = '';
		$scope.showError = false;

		/*
		* Scope Methods
		*/

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
			$location.path('/result');
		}

		$scope.gpsSearch = function(){

		}

}]);