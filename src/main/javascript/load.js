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
	console.log('CallBack init script ! ');
	CST.setInit(typeof google === 'object' && typeof google.maps === 'object');   
}

function loadScript() {
	console.log('Load Script ! ');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 
      'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=initialize';
  document.body.appendChild(script);
}


window.onload = loadScript;
