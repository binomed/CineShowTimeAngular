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
      var markers = [];
      var windows = [];
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
            if (google){
                initGoogleMap();
            }else {
                initLeafletMap();
            }
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
        function clearMarkers(){
            for (var i=0;i < markers.length; i++){
                var marker = markers[i];
                marker.setMap(null);
            }
            markers = [];
        }

        function closeWindows(){
            for (var i=0;i < windows.length; i++){
                var windowPopup = windows[i];
                windowPopup.close();
            }
        }


        $rootScope.$on('proceedRequestEvt', function(evt, results){            
            clearMarkers();
            windows = [];
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
                    markers.push(marker);
                }else{
                    console.log('Geocoder ko : '+status);        
                }
            });
        });

        $rootScope.$on('endLoadServiceEvent', function(evt, theaterResults){
            var geocoder = new google.maps.Geocoder();
            for(var thIdx = 0 ; thIdx < theaterResults.length; thIdx++){
                var theater = theaterResults[thIdx];
                geocodeMapsMethod(theater);
            }
        });


        /*
        * Leaflet
        */

        function initLeafletMap(){
            map = L.map(mapDivElt, {zoomControl : false});
            map.addControl(L.control.zoom({
                position : 'bottomleft'
            }));
            map.locate({setView: true, maxZoom: 16,});//.setView([51.505, -0.09], 13);
            

            L.tileLayer('http://{s}.tile.cloudmade.com/92de9d2696094ca08fc7db73b1aec4a1/997/256/{z}/{x}/{y}.png', {
            //L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
                maxZoom: 18
            }).addTo(map);
        }



        /*
        * Google Maps ! 
        */

        function initGoogleMap(){

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


        function geocodeMapsMethod(theater){
            if(theater.place && theater.place.searchQuery){                    
                console.log('Proceed geocoding request : '+theater.theaterName+" : "+decodeURIComponent(theater.place.searchQuery));
                geocoder.geocode({
                    address : decodeURIComponent(theater.place.searchQuery)
                }, function(results, status){
                    if (status === google.maps.GeocoderStatus.OK){
                        console.log('Geocoding found request : '+theater.theaterName+" : "+results[0].formatted_address);
                        var marker = new google.maps.Marker({
                            map : map,
                            position : results[0].geometry.location, 
                            icon : '../assets/images/marker_theater_red_black.png'
                        });
                        var infowindow = new google.maps.InfoWindow();
                        infowindow.setContent(decodeURIComponent(theater.theaterName).split("+").join(" "));
                        google.maps.event.addListener(marker, 'click', function() {
                            closeWindows();
                            infowindow.open(map,marker);
                            $rootScope.$broadcast('clickTheaterEvt', theater.id);
                        });
                        markers.push(marker);
                        windows.push(infowindow);
                    }else{
                        console.log('Geocoder ko : '+status);        
                    }
                });
            }else{
                console.log('no place found for : '+theater.theaterName);
            }
        }
      
    }
  };
  return directiveDefinitionObject;
}]);

 