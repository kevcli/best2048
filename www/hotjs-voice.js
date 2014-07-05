
hotjs = hotjs || {};
hotjs.voice = hotjs.voice || {};

(function(){
	
//Method 1: get path using the last loaded script, 
//remember, we must append script in resource preloading.
function getCurrentScriptPath() {
	var scripts = document.getElementsByTagName("script");
	var n = scripts.length;
	while( n > 0 ) {
		n --;
		var url = scripts[ n ].src;
		if( url.indexOf('hotjs-voice.js') >= 0 ) return url;
	}
	return '';
}

//Method 2: get with error exception
function getCurrentScriptPath2() {
	var url = '';
	try {
		throw Error("get js path");
	}catch(ex){
		if(ex.fileName) { //Firefox
			url = ex.fileName;
		} else if(ex.sourceURL) { //Safari
			url = ex.sourceURL;
		} else if(ex.stack) { //Chrome or IE10+
			url = (ex.stack.match(/at\s+(.*?):\d+:\d+/)||['',''])[1];
		} else {
			// no such info in ex, iOS 5
		}
	}
	return url;
}

var __FILE__ = getCurrentScriptPath() || getCurrentScriptPath2();

function _F(f) {
	return hotjs.getAbsPath(f, __FILE__);
}

function _T(t) {
	return hotjs.i18n.get(t);
}

var music = {
		'bg': _F('audio/music_bg.mp3')
};

var fx = {
        'logo' : _F('audio/logo.mp3'),
        'happymood' : _F('audio/happymood.mp3'),
        'click' : _F('audio/button1.mp3'),
        'bubble' : _F('audio/bubble.mp3'),
        'bad' : _F('audio/bad_move.mp3'),
        'praise1' : _F('audio/praise1.mp3'),
        'praise2' : _F('audio/praise2.mp3'),
        'praise3' : _F('audio/praise3.mp3'),
        'praise4' : _F('audio/praise4.mp3'),
        'praise5' : _F('audio/praise5.mp3'),
        'fail' : _F('audio/fail.mp3'),
        'win' : _F('audio/win.mp3')
};

function initFX() {
	var f = []; for ( var k in fx ) f.push( fx[k] );
	resources.preloadFX( f );

	var m = []; for (var k in music ) m.push( music[k] );
	resources.preloadMusic( m );
}

var music_on = true;
var fx_on = true;
var lastMusic = null;

function say( what ) {
	if(! fx_on) return;
	
	var f = fx[ what ];
	if(! f) console.log(f + ' not found.');
    resources.playAudio( f, true );
}

function playMusic( what ) {
	var f = music[ what ];
	if(! f) {
		console.log(f + ' not found.');
		return;
	}
	lastMusic = f;
	if(! music_on) return;
	
	resources.playAudio( f, false, true );
}

function stopAllAudio() {
	for ( var k in fx ) {
		resources.stopAudio( fx[k] );
	}
	for ( var k in music ) {
		resources.stopAudio( music[k] );
	}
	lastMusic = null;
}

function switchAudio() {
	if(music_on) {
		if(lastMusic != null) resources.playAudio( lastMusic, false, true );
	} else {
		for ( var k in music ) {
			resources.stopAudio( music[k] );
		}
	}
	
	if(! fx_on) {
		for ( var k in fx ) {
			resources.stopAudio( fx[k] );
		}
	}
}

function enableAudio( what, on ) {
	if(what == 'music') {
		music_on = on;
	} else if( what == 'fx' ) {
		fx_on = on;
	} else {
		music_on = on;
		fx_on = on;
	}
	
	switchAudio();
}

function toggleAudio( what ) {
	if(what == 'music') {
		music_on = ! music_on;
	} else if( what == 'fx' ) {
		fx_on = ! fx_on;
	} else {
		music_on = ! music_on;
		fx_on = ! fx_on;
	}

	switchAudio();
}


hotjs.voice.init = initFX;
hotjs.voice.enable = enableAudio;
hotjs.voice.toggle = toggleAudio;
hotjs.voice.say = say;
hotjs.voice.playMusic = playMusic;
hotjs.voice.stopAllAudio = stopAllAudio;

})();

