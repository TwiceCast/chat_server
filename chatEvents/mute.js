const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');

module.exports = {
	RegisterEvent: function(client) {
		client.on('mute', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client mute error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.MuteProperties, events.MUTE_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'Mute syntax error !'});
				console.log("Client mute error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToMute = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToMute = rclient;
                    }
                });
                if (clientToMute != null) {
                    console.log('Muting...' + client.username + ' for ' + data.duration + 's');
                    clientToMute.emit('mute', {'duration': data.duration});
                    client.emit('mute', {'message': 'Success', 'reason': data.username + ' has been muted for ' + data.duration});
                    clientToMute.isMuted = true;
                    clientToMute.muteDate = Date.now();
                    clientToMute.muteDuration = +data.duration;
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'Mute error (user not found) !'});
                    console.log('Client mute error ! (user not found)');
                }
			}
		});
	}
}
