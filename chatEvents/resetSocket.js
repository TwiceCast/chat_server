module.exports = {
	RegisterEvent: function(client) {
		client.on('resetSocket', function() {
			if (!client.testMode) {
				client.emit('cerror', {'code': 403, 'message': 'Client not in test mode'});
				console.log('resetSocket error !');
			} else {
				client.username = null;
				if (client.room) {
					client.leave(client.room);
				}
				client.room = null;
				client.password = null;
				console.log('socket reset !');
			}
		});
	}
}
