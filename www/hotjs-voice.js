
hotjs = hotjs || {};
hotjs.voice = hotjs.voice || {};

(function(){
	
var music = {
		'bg': 'audio/music_bg.mp3'
};

var fx = {
        'logo' : 'audio/logo.mp3',
        'happymood' : 'audio/happymood.mp3',
        'click' : 'audio/button1.mp3',
        'bubble' : 'audio/bubble.mp3',
        'bad' : 'audio/bad_move.mp3',
        'praise1' : 'audio/praise1.mp3',
        'praise2' : 'audio/praise2.mp3',
        'praise3' : 'audio/praise3.mp3',
        'praise4' : 'audio/praise4.mp3',
        'praise5' : 'audio/praise5.mp3',
        'fail' : 'audio/fail.mp3',
        'win' : 'audio/win.mp3'
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

var paused = false;
var last_music_on = true;
var last_fx_on = true;
function pauseAudio() {
	last_music_on = music_on;
	last_fx_on = fx_on;
	paused = true;
	
	music_on = false;
	fx_on = false;
	switchAudio();
}

function resumeAudio() {
	music_on = last_music_on;
	fx_on = last_fx_on;
	paused = false;
	
	switchAudio();
}

hotjs.voice.init = initFX;
hotjs.voice.enable = enableAudio;
hotjs.voice.toggle = toggleAudio;
hotjs.voice.pause = pauseAudio;
hotjs.voice.resume = resumeAudio;
hotjs.voice.say = say;
hotjs.voice.playMusic = playMusic;
hotjs.voice.stopAllAudio = stopAllAudio;

})();

