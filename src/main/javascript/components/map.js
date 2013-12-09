components.directive('map', ['ModelFactory', '$rootScope', '$timeout','$location'
  ,function (model, $rootScope,$timeout,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/map.html',
    replace: true,
    restrict: 'EA',
    scope: {        
      zoom: '=zoom',
      center: '=center'
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      var mapDivElt = iElement.find('div')[0];
      /*navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position.coords.latitude + " " + position.coords.longitude);
          plotMap(position.coords.latitude, position.coords.longitude);
          //document.getElementById('info').innerHTML = "";
      }, function(position) {
          alert("Failed to get your current location");
      });
        */

        // Solution possible : https://groups.google.com/forum/#!searchin/mozilla.dev.b2g/google$20maps/mozilla.dev.b2g/56RBo2pBbL4/P1sl-IxnR0MJ

        // http://leafletjs.com/download.html
        //https://github.com/smeijer/L.GeoSearch/wiki
        // http://open.mapquestapi.com/nominatim/
        //http://stackoverflow.com/questions/17726177/can-i-use-openstreetmap-nominatim-reverse-geolocation-api-in-a-commercial-app
        var map = null;
        
        var geocoder = null;
      
        function initMap(){

           var mapOptions = {
                center: new google.maps.LatLng($scope.center.lat, $scope.center.lng),
                zoom: $scope.zoom,
                mapTypeControl : false,
                panControl : false,
                streetViewControl : false,
                scaleControl : false,
                zoomControlOptions : { position : google.maps.ControlPosition.LEFT_BOTTOM},
                overviewMapControl : false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(mapDivElt, mapOptions);            
            console.log("mapInit");
              
            $scope.$watch('zoom', function (newValue) {
                map.setZoom(parseInt(newValue));
            });

            $scope.$watch('center', function (newValue) {
                map.setCenter(new google.maps.LatLng(
                    parseFloat(newValue.lat),
                    parseFloat(newValue.lng))
                );
            }, true);
            google.maps.event.addListener(map, 'zoom_changed', function () {
                $timeout(function () {
                    $scope.zoom = map.getZoom();
                });
            });

            google.maps.event.addListener(map, 'center_changed', function () {
                $timeout(function () {
                    $scope.center = {
                        lat: map.getCenter().lat(),
                        lng: map.getCenter().lng()
                    };
                });
            });

            console.log("endPlotMap");
        }

        initMap();
        /*
        if (CST.initMaps){
            initMap();
        }else{
            CST.registerInit(function(init){
                if (!init){
                    console.log('CallBack but not init ! ');
                }else{
                    initMap();
                }
            });
            console.log('Maps Not Init');
        }
        */

        //$scope.snapshots = snapshots;
        $scope.addMarker = function () {
            $scope.waiting = true;
            var snapshot = {
                lat: parseFloat($scope.center.lat),
                lng: parseFloat($scope.center.lng),
                zoom: parseInt($scope.zoom),
                label: $scope.label
            };
            $timeout(function () {
                $scope.snapshots.push(snapshot);
                $scope.waiting = false;
            }, 2000);
            new google.maps.Marker({
                position: new google.maps.LatLng(snapshot.lat, snapshot.lng),
                map: map,
                title: snapshot.label
            });
            $scope.label = '';
        };
        $scope.goto = function (snapshot) {
            $scope.zoom = snapshot.zoom;
            $scope.center = {
                lat: snapshot.lat,
                lng: snapshot.lng
            };
        };

         $rootScope.$on('proceedRequestEvt', function(evt, results){            
            geocoder.geocode({
                address : model.getRequest().cityName
            }, function(results, status){
                if (status === google.maps.GeocoderStatus.OK){
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(11);
                    var marker = new google.maps.Marker({
                        map : map,
                        position : results[0].geometry.location
                    });
                }else{
                    console.log('Geocoder ko : '+status);        
                }
            });
        });

        $rootScope.$on('endLoadServiceEvent', function(evt, theaterResults){
            var geocoder = new google.maps.Geocoder();
            for(var thIdx = 0 ; thIdx < theaterResults.length; thIdx++){
                var theater = theaterResults[thIdx];
                if(theater.place && theater.place.searchQuery){                    

                    geocoder.geocode({
                        address : decodeURIComponent(theater.place.searchQuery)
                    }, function(results, status){
                        if (status === google.maps.GeocoderStatus.OK){
                            var marker = new google.maps.Marker({
                                map : map,
                                position : results[0].geometry.location, 
                                icon : '../assets/images/marker_theater.png'
                            });
                            var infowindow = new google.maps.InfoWindow();
                            infowindow.setContent(decodeURIComponent(theater.theaterName));
                            google.maps.event.addListener(marker, 'click', function() {
                                infowindow.open(map,marker);
                            });
                        }else{
                            console.log('Geocoder ko : '+status);        
                        }
                    });
                }else{
                    console.log('no place found for : '+theater.theaterName);
                }
            }
        });
      
    }
  };
  return directiveDefinitionObject;
}]);

 