var testProcessing = require('./testProcessing');
var config = require('./config');

module.exports = {
	name: "BasicAuth",
	
	missingParameters: function(socket) {
		var success = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', fail);
		socket.on('cerror', success);
		socket.emit('auth', {'username': 'mdr', 'password':'lol'});
	},
	
	tooManyParameters: function(socket) {
		var success = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', fail);
		socket.on('cerror', success);
		socket.emit('auth', {'username': 'mdr', 'password':'lol', 'room': 'test', 'moreArg': 'arg'});
	},
	
	wrongParameters: function(socket) {
		var success = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', fail);
		socket.on('cerror', success);
		socket.emit('auth', {'username': 'mdr', 'passwords':'lol', 'room': 'testroom'});
	},
	
	noParameter: function(socket) {
		var success = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', fail);
		socket.on('cerror', success);
		socket.emit('auth', {});
	},
	
	validAuth: function(socket) {
		var success = function(data) {
			socket.off('auth', success);
			socket.off('cerror', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('auth', success);
			socket.off('cerror', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('cerror', fail);
		socket.on('auth', success);
		socket.emit('auth', {'username': 'mdr', 'password': 'lol', 'room': 'testroom'});
	},
	
	emptyRoomName: function(socket) {
		var success = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', fail);
		socket.on('cerror', success);
		socket.emit('auth', {'username': 'mdr', 'password':'lol', 'room': ''});
	},
	
	emptyUsername: function(socket) {
		var success = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', fail);
		socket.on('cerror', success);
		socket.emit('auth', {'username': '', 'password':'lol', 'room': 'testroom'});
	},
	
	emptyPassword: function(socket) {
		var success = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', success);
			socket.off('auth', fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', fail);
		socket.on('cerror', success);
		socket.emit('auth', {'username': 'mdr', 'password':'', 'room': 'testroom'});
	},
	
	alreadyAuth: function(socket) {
		var success = function(data) {
			socket.off('auth', fail);
			socket.off('cerror', success);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, fail, success);
		
		var fail = function(data) {
			socket.off('auth', fail);
			socket.off('cerror', success);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var failStep1 = function(data) {
			socket.off('auth', step1);
			socket.off('cerror', failStep1);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, step1, failStep1);
		
		var step1 = function(data) {
			socket.off('auth', step1);
			socket.off('cerror', failStep1);
			socket.on('auth', fail);
			socket.on('cerror', success);
			socket.emit('auth', {'username': 'mdr', 'password': 'lol', 'room': 'testroom'});
		}.bind(this, socket, testProcessing, step1, failStep1, success, fail);
		
		socket.on('auth', step1);
		socket.on('cerror', failStep1);
		socket.emit('auth', {'username': 'mdr', 'password': 'lol', 'room': 'testroom'});
	}
}
