const ClientManager = require('../ClientManager');

module.exports = {
	RegisterEvent: function(client) {
		client.on('disconnect', function(){
			if (client.username)
				console.log(client.username + " left !");
			else
				console.log('Un-Auth user left !');
			client.username = null;
			if (client.room) {
				client.leave(client.room);
			}
			client.room = null;
			client.password = null;
			client.token = null;
			
			ClientManager.RemoveClient(client);
		});
	}
}
