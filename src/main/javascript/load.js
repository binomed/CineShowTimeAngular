var CST = CST || function(){

	var initMaps = false;
	var callback = null;

	function setInit(init){
		initMaps = init;
		if (callback){
			callback(init);
		}
	}

	function registerInit(callbackToSet){
		callback = callbackToSet;
	}

	return{
		initMaps : initMaps,
		setInit : setInit,
		registerInit : registerInit
	};
}();

function initialize() {
	
	CST.setInit(google != null);   
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 
      'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDyIPjOPfFqVH4V5bkdBatTOiJLxnxvGuI&sensor=true&callback=initialize';
  document.body.appendChild(script);
}


window.onload = loadScript;
