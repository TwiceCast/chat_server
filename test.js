/************************
**   DO NOT TOUCH !!   **
** Module requirements **
************************/
var config = require('./tests/config.js');
var io = require('socket.io-client');
var colors = require('colors');
var readline = require('readline');
var testProcessing = require('./tests/testProcessing');
var testList = require('./tests/TESTS');



/**************************
** REGISTER TEST MODULES **
**          HERE         **
**************************/

/*
** Test module dependencies
*/
var basicAuth = require('./tests/basicAuth');

/*
** Test module registrations
*/
var testModules = [basicAuth];




/***************************
** DO NOT TOUCH BELOW !!! **
**   Script starts here   **
***************************/

/*
** Registrating tests
*/
for (var ind in testModules) {
	var module = testModules[ind];
	for (var p in module) {
		if (typeof module[p] == 'function') {
			testList.TESTS.push(module[p]);
		}
	}
}

/*
** Connecting to server
*/
console.log('Connecting to '.cyan + config.SERVER_URL.cyan);
var socket = io('http://' + config.SERVER_URL, {'reconnectionAttempts': config.RECONNECT_ATTEMPS});

/*
** Display sockets infos
*/
socket.on('connect', function(){
	console.log('Connection ' + 'OK '.green + '!');
	testProcessing.test(socket);
});

socket.on('disconnect', function() {
	console.log('Disconnected !'.cyan);
});

socket.on('reconnecting', function(attempt) {
	console.log('Reconnecting...'.yellow + attempt);
});

socket.on('connect_error', function() {
	console.log('Connection failed !'.red);
});

socket.on('reconnect_failed', function() {
	console.log('Failed to connect !\nPlease launch a server before or double check connection creds'.red);
	return 1;
});

return 0;