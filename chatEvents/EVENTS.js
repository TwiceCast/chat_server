/* CHAT EVENTS IMPORTS */
const authEvent = require('./auth');
const messageEvent = require('./message');
const disconnectEvent = require('./disconnect');
const kickEvent = require('./kick');
const muteEvent = require('./mute');

/* TEST EVENTS IMPORTS */
const resetSocketEvent = require('./resetSocket');
const setTestModeEvent = require('./setTestMode');

module.exports = {
	EVENTS: [
	/* CHAT EVENTS */
	authEvent, messageEvent, disconnectEvent, kickEvent, muteEvent,
	/* TEST EVENTS */
	resetSocketEvent, setTestModeEvent
	],
	
	RegisterEvents: function(client) {
		console.log('registering events');
		
		this.EVENTS.forEach(function(ev) {
			ev.RegisterEvent(client);
		});
	}
}
