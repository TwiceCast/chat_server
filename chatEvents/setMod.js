const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');

module.exports = {
	RegisterEvent: function(client) {
		client.on('setMod', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client setMod error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.SetModProperties, events.SET_MOD_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'SetMod syntax error !'});
				console.log("Client setMod error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToSetMod = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToSetMod = rclient;
                    }
                });
                if (clientToSetMod != null) {
                    console.log(client.username + ' is now Mod');
                    // SET MOD HERE
                    //clientToSetMod.emit('SetMod', {});
                    client.emit('setMod', {'message': 'Success', 'reason': data.username + ' is now Mod'});
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'SetMod error (user not found) !'});
                    console.log('Client SetMod error ! (user not found)');
                }
			}
		});
	}
}
