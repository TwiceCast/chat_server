/* CHAT EVENTS IMPORTS */
const authEvent = require('./auth');
const messageEvent = require('./message');
const disconnectEvent = require('./disconnect');

/* TEST EVENTS IMPORTS */
const resetSocketEvent = require('./resetSocket');
const setTestModeEvent = require('./setTestMode');

module.exports = {
	EVENTS: [
	/* CHAT EVENTS */
	authEvent, messageEvent, disconnectEvent,
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
