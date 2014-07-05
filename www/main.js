// if device not ready, wait for device API libraries to load
var device_ready = false;

var app_key = 'com.rjfun.best2048';
var app_version = '1.0.20140705';
var app_vercode = 20140705;

var app_url = 'http://rjfun.com/best2048/';
var autorun_url = app_url + 'autorun.js'; // will run when client start
var share_link_url = app_url; // will share in social sharing

var app_data = {};

function resetData() {
	app_data.cfg = {
			ui : 0,
			voice : 0,
			music : 1,
			fx : 1
		};
}

function mockData() {
	
}

function loadData() {
	var data_str = localStorage.getItem( app_key );
	if( data_str ) {
		app_data = JSON.parse( data_str );
	} else {
		resetData();
	}
	
	// fix data
	if(! app_data.cfg) app_data.cfg = {};
	if(! app_data.cfg.ui) app_data.cfg.ui = 0;
	if(! app_data.cfg.voice) app_data.cfg.voice = 0;
	if(! app_data.cfg.music) app_data.cfg.music = 1;
	if(! app_data.cfg.fx) app_data.cfg.fx = 1;
}

function saveData() {
	localStorage.setItem( app_key, JSON.stringify(app_data) );
}

function doAlert(msg, title) {
	if(navigator && navigator.notification && navigator.notification.alert) {
		navigator.notification.alert(msg, function(){}, title);
	} else {
		alert(msg);
	}
}

function doConfirm(msg, title, okfunc, cancelfunc) {
	if(navigator && navigator.notification && navigator.notification.confirm) {
		navigator.notification.confirm(msg, function(btnIndex){
			if(btnIndex == 1) okfunc();
			else cancelfunc();
		}, title);
	} else {
		if(confirm(msg)) okfunc();
		else cancelfunc();
	}
}

function openURL( url ) {
	if (typeof navigator !== "undefined" && navigator.app) {
		// Mobile device.
		navigator.app.loadUrl(url, {
			openExternal : true
		});
	} else {
		// Possible web browser
		window.open(url, "_blank");
	}
}

var stackedPages = [];
var currentPage = null;

function showPage( pgid ) {
	$('div.page').hide();
	$('div#' + pgid).show();
	currentPage = pgid;
}

function pushPage( pgid ) {
	if(currentPage != null) stackedPages.push( currentPage );
	showPage( pgid );
}

function popPage() {
	if( stackedPages.length >0) {
		showPage( stackedPages.pop() );
		return true;
	}
	
	return false;
}

function pageBack() {
	// pause game
	
	popPage();
}

function onClickBackButton(e) {
	e.preventDefault();
	//if(!! app_data.cfg.voice_btn) hotjs.voice.say('click');
	
	if(stackedPages.length >0) {
		pageBack();
	} else {
		hotjs.voice.stopAllAudio();
		navigator.app.exitApp();
	}
}

function updateSettings() {
	$('.opt').each(function(i){
		var k = $(this).attr('k');
		var v = $(this).attr('v');
		var cfg_v = app_data.cfg[ k ];
		
		if($(this).attr('type') == 'checkbox') {
			if(v == cfg_v) {
				this.checked = true;
			} else {
				this.checked = false;
			}
		} else {
			if(v == cfg_v) {
				$(this).addClass('selected');
			} else {
				$(this).removeClass('selected');
			}
		}
	});
}

function applySettings() {
	// voice, no need, when say, will check
	var v = 'robot';
	switch( app_data.cfg.voice ) {
	case '1': v = 'cute'; break;
	case '0':
	default:
		v = 'robot'; break;
	}
	hotjs.voice.init( v );
}


function initUIEvents() {
	var isMobile = ( /(android|ipad|iphone|ipod)/i.test(navigator.userAgent) );
	var CLICK = 'click'; //isMobile ? 'touchstart' : 'mousedown';
	
	document.onselectstart = function() {return false;} // ie 
	document.onmousedown = function() {return false;} // mozilla 
	
	$(document).on('backbutton', onClickBackButton);

	$('.mute-button').on(CLICK, function(e){
		e.preventDefault();
		var mute = ($(this).attr('mute') === 'true');
		mute = ! mute;
		hotjs.voice.enable('both', ! mute);
		
		$('.mute-button').attr('mute', mute?'true':'false');
		
	});
}

function _T(s) {
	if(! hotjs) return s;
	if(! hotjs.i18n) return s;
	if(! hotjs.i18n.get) return s;
	return hotjs.i18n.get(s);
}

function main() {
    var w = screen.width, h = screen.height;
    console.log( 'screen:' + w + ' x ' + h );
    
	w = window.innerWidth, h = window.innerHeight;
    console.log( 'window:' + w + ' x ' + h );
    
    // we only display ad if screen large enough
    if(h == w * 1.5) {
    	// iphone, screen not long enough
    	$('p.game-explanation').hide();
    } else {
        hotjs.Ad.init();
    }
	
	hotjs.voice.init();
	
	//alert('lang: ' + hotjs.i18n.getLang() + ', ' + _T('about'));
	var isIOS = ( /(ipad|iphone|ipod)/i.test(navigator.userAgent) );
	if(isIOS) {
		hotjs.i18n.translate();
	} else {
		// TODO: translate for android testing failed, reason unknown.
	}

    loadData();
    updateSettings();
    applySettings();
    
    initUIEvents();
    
	showPage('splashpage');
	
	window.setTimeout(function(){
		device_ready = true;
		
		showPage('homepage');
		hotjs.voice.playMusic('bg');
		
		hotjs.require( autorun_url );
		
	},2000);
}

