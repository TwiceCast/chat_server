var testProcessing = require('./testProcessing');
var config = require('./config');

module.exports = {
	name: "BasicFormating",
	
	basicFormating: function(socket) {
		var stepAuth = function(data) {
			socket.off('auth', stepAuth);
			socket.off('cerror', failStepAuth);
			socket.on('cerror', fail);
			socket.on('message', success);
			socket.emit('message', {'content': 'test basic message'});
		}.bind(this, socket, testProcessing, success, fail, failStepAuth, stepAuth);
		
		var failStepAuth = function(data) {
			socket.off('auth', stepAuth);
			socket.off('cerror', failStepAuth);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, stepAuth, failStepAuth);
		
		var success = function(data) {
			socket.off('cerror', fail);
			socket.off('message', success);
			testProcessing.validateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		var fail = function(data) {
			socket.off('cerror', fail);
			socket.off('message', success);
			testProcessing.unvalidateTest(socket);
		}.bind(this, socket, testProcessing, success, fail);
		
		socket.on('auth', stepAuth);
		socket.on('cerror', failStepAuth);
		socket.emit('auth', {'username': 'mdr', 'password':'lol', 'room': 'test'});
	}
}
