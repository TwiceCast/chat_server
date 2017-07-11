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
var basicMessages = require('./tests/basicMessages');
var basicFormating = require('./tests/basicFormating');

/*
** Test module registrations
*/
var testModules = [basicAuth, basicMessages, basicFormating];




/***************************
** DO NOT TOUCH BELOW !!! **
**   Script starts here   **
***************************/

/*
** Registrating tests
*/
for (var ind in testModules) {
	var module = testModules[ind];
	if (module.hasOwnProperty('name')) {
		testList.TESTS[module.name] = [];
		for (var p in module) {
			if (typeof module[p] == 'function') {
				testList.TESTS[module.name].push(module[p]);
			}
		}
	}
	else {
		console.log('Missing parameter name (' + ind + ')');
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
	socket.emit('setTestMode', {'value': true});
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