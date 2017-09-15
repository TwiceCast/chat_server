const config = require('../config');
const utils = require('../utils');
const events = require('../events');

module.exports = {
	RegisterEvent: function(client) {
		client.on('setTestMode', function(data) {
			if (!utils.hasProperties(data, events.SetTestModeProperties, events.SET_TEST_MODE_STRICT) == true) {
				client.emit('cerror', {'code': 400, 'message': 'SetTestMode syntax error'});
				console.log('setTestMode failed');
			}
			else if (!config.TEST_MODE_ENABLE) {
				client.emit('cerror', {'code': 403, 'message': 'Test mode not permitted by server'});
				console.log('setTestMode failed (Not permitted)');
			}
			else {
				client.testMode = data.value;
				console.log('Test mode switch ! (' + data.value + ')');
			}
		});
	}
}
