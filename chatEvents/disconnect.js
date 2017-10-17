const ClientManager = require('../ClientManager');
const config = require('../config');

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
            client.uid = -1;
			client.room = null;
			client.password = null;
			client.token = null;
            client.chatToken = null;
            client.rank = config.RIGHTS.UNKNOW;
			
			ClientManager.RemoveClient(client);
		});
	}
}
