var testProcessing = require('./testProcessing');
var config = require('./config');

module.exports = {
	wrongParameters: function(socket) {
		var success = function(data) {
			socket.off('cerror', this.success);
			socket.off('auth', this.fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing);
		
		var fail = function(data) {
			socket.off('cerror', this.success);
			socket.off('auth', this.fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing);
		
		socket.emit('auth', {'username': 'mdr', 'password':'lol'});
		socket.on('auth', fail);
		socket.on('cerror', success);
	},
	
	validAuth: function(socket) {
		var success = function(data) {
			socket.off('auth', this.success);
			socket.off('cerror', this.fail);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing);
		
		var fail = function(data) {
			socket.off('auth', this.success);
			socket.off('cerror', this.fail);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing);
		
		socket.emit('auth', {'username': 'mdr', 'password':'lol', 'room': 'testroom'});
		socket.on('cerror', fail);
		socket.on('auth', success);
	}
}
