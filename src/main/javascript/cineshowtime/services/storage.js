cst.factory('StorageFactory',['$rootScope', '$http', 'ModelFactory',function($rootScope, $http, model){

	var FAV = "fav_n";
	var INDEX_FAVS = "index_favs";
	var localStoragePresent = Modernize.localStorage;


	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/


	function addFavorite(theater){
		if (localStoragePresent){
			var indexs = localStorage[INDEX_FAVS];
			if(!indexs){
				indexs = [];
			}
			localStorage[FAV+theater.id] = JSON.stringify(theater);
			indexs.push(theater.id);
			localStorage[INDEX_FAVS] = indexs;
		}
	}

	function removeFavorites(theater){
		if (!localStoragePresent){
			return;
		}

		var indexs = localStorage[INDEX_FAVS];
		if(!indexs){
			return;
		}

		var position = indexs.indexOf(theater.id);
		if (position === -1){
			return;
		}
		indexs = indexs.splice(position,1);
		localStorage[INDEX_FAVS] = indexs;
		localStorage.removeItem(FAV+theater.id);
	}

	function getFavorites(){
		var favorites = [];
		if (!localStoragePresent){
			return favorites;
		}
		var indexs = localStorage[INDEX_FAVS];
		if(indexs){			
			for (var i = 0; i < indexs.length; i++){
				favorites.push(JSON.parse(localStorage[FAV+indexs[i]]));
			}
		}
		return favorites;
	}

	return{
		//Apis
		addFavorite : addFavorite,
		removeFavorite : removeFavorite,
		getFavorites : getFavorites
	};
}]);