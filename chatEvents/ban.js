const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');

module.exports = {
	RegisterEvent: function(client) {
		client.on('ban', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client ban error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.BanProperties, events.BAN_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'Ban syntax error !'});
				console.log("Client ban error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToBan = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToBan = rclient;
                    }
                });
                if (clientToBan != null) {
                    console.log('Banning...' + client.username);
                    clientToBan.emit('ban', {'message': 'Disconnected', 'reason':'You have been banned !'});
                    client.emit('ban', {'message': 'Success', 'reason': data.username + ' has been banned'});
                    clientToBan.disconnect(true);
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'Ban error (user not found) !'});
                    console.log('Client ban error ! (user not found)');
                }
			}
		});
	}
}
