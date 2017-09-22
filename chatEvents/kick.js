const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');

module.exports = {
	RegisterEvent: function(client) {
		client.on('kick', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client kick error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.KickProperties, events.KICK_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'Kick syntax error !'});
				console.log("Client kick error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToKick = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToKick = rclient;
                    }
                });
                if (clientToKick != null) {
                    console.log('Kicking...' + client.username);
                    clientToKick.emit('kick', {'message': 'Disconnected', 'reason':'You have been kicked !'});
                    client.emit('kick', {'message': 'Success', 'reason': data.username + ' has been kicked'});
                    clientToKick.disconnect(true);
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'Kick error (user not found) !'});
                    console.log('Client kick error ! (user not found)');
                }
			}
		});
	}
}
