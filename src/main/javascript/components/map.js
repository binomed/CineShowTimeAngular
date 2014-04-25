components.directive('map', ['ModelFactory', 'GeoServicesFactory', '$rootScope', '$timeout','$location'
  ,function (model, geoService, $rootScope,$timeout,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/map.html',
    replace: true,
    restrict: 'EA',
    scope: {        
      zoom: '=zoom',
      center: '=center',
      unlocateTheater : '=unlocateTheater'
    },    
    link: function postLink($scope, iElement, iAttrs) { 

        var useGoogleMaps = false;//typeof google === 'object' && typeof google.maps === 'object';      
        //useGoogleMaps = false;
        var mapDivElt = iElement.find('div')[0];
        var markers = [];
        var windows = [];
      
        // Solution possible : https://groups.google.com/forum/#!searchin/mozilla.dev.b2g/google$20maps/mozilla.dev.b2g/56RBo2pBbL4/P1sl-IxnR0MJ

        // http://leafletjs.com/download.html
        //https://github.com/smeijer/L.GeoSearch/wiki
        // http://open.mapquestapi.com/nominatim/
        //http://stackoverflow.com/questions/17726177/can-i-use-openstreetmap-nominatim-reverse-geolocation-api-in-a-commercial-app
        var map = null;        
        var geocoder = null;

        function initMap(){
            useGoogleMaps = false;//typeof google === 'object' && typeof google.maps === 'object';      
            if (useGoogleMaps){
                initGoogleMap();
            }else {
                initLeafletMap();
            }
        }
      

        /*navigator.geolocation.getCurrentPosition(function(position){
            initMap();

        },function(position){
            console.log('Fail to get location');
        });*/ 
      
        initMap();
   
        function clearMarkers(){
            for (var i=0;i < markers.length; i++){
                var marker = markers[i];
                if (useGoogleMaps){
                    marker.setMap(null);
                }else{
                    map.removeLayer(marker);
                }
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
            locateAddress(model.getRequest().cityName);
            
        });

        $rootScope.$on('endLoadServiceEvent', function(evt, theaterResults){            
            for(var thIdx = 0 ; thIdx < theaterResults.length; thIdx++){
                var theater = theaterResults[thIdx];
                    setTimeout(function(theaterToUse, indexTheater) {
                        if (useGoogleMaps){
                            geocodeGoogleMapsMethod(theaterToUse, indexTheater);
                        }else{
                            geocodeLeafLetMethod(theaterToUse, indexTheater);
                        }
                    }, 500 * thIdx, theater, thIdx);

            }
        });

        $scope.$watch('zoom', function (newValue) {
            if (map == null){
                return;
            }
            if (useGoogleMaps){
                map.setZoom(parseInt(newValue));
            }
        });

        $scope.$watch('center', function (newValue) {
            if (map == null){
                return;
            }
            if(useGoogleMaps){
                map.setCenter(new google.maps.LatLng(
                    parseFloat(newValue.lat),
                    parseFloat(newValue.lng))
                );
            }else{
                map.setView([ parseFloat(newValue.lat),  parseFloat(newValue.lng)], 13);
            }
        }, true);

        function locateAddress(address){
           if (useGoogleMaps){
                locateAddressGoogle(address);
           }else{
                locateAddressLeafLet(address);

           }
        }


        /*
        * Leaflet
        */

        var leafLetIcon = null;
        function getLeafLetIcon(){
            if(!useGoogleMaps){

              leafLetIcon = L.icon({
                    iconUrl : '../assets/images/marker_theater_red_black.png',
                    iconSize: [32, 37],
                    iconAnchor: [16, 36],
                    popupAnchor: [-3, -30]
                });
            } 
            return leafLetIcon;
        }


        function initLeafletMap(){
            map = L.map(mapDivElt, {
                zoomControl : false
            });
            map.addControl(L.control.zoom({
                position : 'bottomleft'
            }));
            map.locate({setView: true, maxZoom: 16,});//.setView([51.505, -0.09], 13);
            

            L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
            //L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
                attribution: 'Map data, Imagery © <a href="http://www.mapquest.com">MapQuest</a>',
                maxZoom: 18
            }).addTo(map);

             map.on('popupopen', function(popup){
                console.log('Open Popup : ');
                console.log(popup);
                if (popup.popup 
                    && popup.popup._contentNode
                    && popup.popup._contentNode.firstChild){
                    $rootScope.$apply(function(){
                        $rootScope.$emit('clickTheaterEvt', popup.popup._contentNode.firstChild.id);
                    });
                }
            });
        }

         function locateAddressLeafLet(address){
           geoService.geoSearch(address, function(data){
                if (data){
                    var marker = new L.marker([data.lat, data.lon]);
                    map.addLayer(marker);                    
                    map.setView([data.lat, data.lon], 13);
                    markers.push(marker);
                }
           });
        }

        function placeLeafLetMarker(theater, index){
            var marker = new L.marker([theater.lat, theater.lon], {icon : getLeafLetIcon()});
            marker.bindPopup("<div id='"+theater.id+"'>"+theater.theaterName+"</div>");
            map.addLayer(marker);
            markers.push(marker);
            if (index === 0){
                marker.openPopup();
            }
        }

         function geocodeLeafLetMethod(theater, index){
            if(theater.place && theater.place.searchQuery && !theater.lat && !theater.lon && !theater.unlocate){                
                console.log('Proceed geocoding request : '+theater.theaterName+" : "+theater.place.searchQuery);
                geoService.geoSearch(theater.place.searchQuery, function(data){
                    if (data){
                        console.log('Geocoding found request : '+theater.theaterName+" : "+data.display_name+" ("+data.lat+";"+data.lon+")");
                        theater.lat = data.lat;
                        theater.lon = data.lon;
                        placeLeafLetMarker(theater, index);                        
                    }else{
                        
                        theater.unlocate = true;
                        $scope.unlocateTheater.push(theater);
                        console.log('Geocoding ko : '+theater.theaterName);        
                        
                    }
                });                

            }else if(theater.place && theater.place.searchQuery && theater.lat && theater.lon && !theater.unlocate){ 
                placeLeafLetMarker(theater, index);
            }else{
                $scope.unlocateTheater.push(theater);
                console.log('no place found for : '+theater.theaterName);
            }
        }



        /*
        * Google Maps ! 
        */

        function locateAddressGoogle(address){
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
        }

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

        function placeGoogleMapsMarker(theater, index){
            var marker = new google.maps.Marker({
                map : map,
                position : new google.maps.LatLng(theater.lat,theater.lon), 
                icon : '../assets/images/marker_theater_red_black.png'
            });
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent("<div id='infoWindowPopup"+theater.id+"'>"+decodeURIComponent(theater.theaterName).split("+").join(" ")+"</div>");
            google.maps.event.addListener(marker, 'click', function() {
                closeWindows();
                infowindow.open(map,marker);                
                map.setCenter(marker.getPosition());
                $rootScope.$emit('clickTheaterEvt', theater.id);
                var popupDiv = document.querySelector('#infoWindowPopup'+theater.id);
                popupDiv.removeEventListener('click');
                popupDiv.addEventListener('click', function(){
                    alert('click on theater !');
                });                
                console.log('popup present ? ');
                console.log(popupDiv);

            });
            markers.push(marker);
            windows.push(infowindow);

            if (index === 0){
                infowindow.open(map,marker);
                map.setCenter(new google.maps.LatLng(theater.lat,theater.lon));
            }
        }

        function geocodeGoogleMapsMethod(theater, index){
            if(theater.place && theater.place.searchQuery && !theater.lat && !theater.lon && !theater.unlocate){                    
                console.log('Proceed geocoding request : '+theater.theaterName+" : "+theater.place.searchQuery);
                geocoder.geocode({
                    address : theater.place.searchQuery
                }, function(results, status){
                    if (status === google.maps.GeocoderStatus.OK){
                       console.log('Geocoding found request : '+theater.theaterName+" : "+results[0].formatted_address);
                       theater.lat = results[0].geometry.location.lat();
                       theater.lon = results[0].geometry.location.lng();
                       placeGoogleMapsMarker(theater, index);
                       
                    }else{
                        $scope.$apply(function(){
                            theater.unlocate = true;
                            $scope.unlocateTheater.push(theater);
                            console.log('Geocoder ko : '+status);        
                        });
                    }
                });
            }else if (theater.place && theater.place.searchQuery && theater.lat && theater.lon && !theater.unlocate){
                placeGoogleMapsMarker(theater);
            }else{
                $scope.unlocateTheater.push(theater);
                console.log('no place found for : '+theater.theaterName);
            }
        }
      
    }
  };
  return directiveDefinitionObject;
}]);

 