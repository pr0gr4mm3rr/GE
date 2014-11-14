var user = {};
var storage = {};

var responseObj = {};
var planet = {};
var scrollers = {};
var onPage = 'Main';
var onSubPage = '';
var iconsPath = 'images/theme/items/';
var graphicPath = 'images/theme/320/';  

var config = {
    device: 'ios', // 'ios', 'android', 'wp', 'browser'
    app:true,
    debug: false,
    logToDevice: false,
	logType: 'alert',// none, device, alert, navigator, console
    isOnDevice: true,
	gameName: "GE",
	gameNameShort: "GE",
    version: "1.6.5",
	lang: 'en',
	live: 1, // 1-on / 0-off
	gamePaused: false,
	/* XHR */
	gameURL: 'http://ge.seazonegames.com/api.php',
	domain: 'http://ge.seazonegames.com/',
	timeout: 10000,
	dataType: 'json'	
};