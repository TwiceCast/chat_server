const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');

module.exports = {
	RegisterEvent: function(client) {
		client.on('delMod', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client delMod error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.SetModProperties, events.SET_MOD_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'DelMod syntax error !'});
				console.log("Client delMod error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToDetMod = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToDetMod = rclient;
                    }
                });
                if (clientToSetMod != null) {
                    console.log(client.username + ' is not Mod anymore');
                    // DEL MOD HERE
                    //clientToSetMod.emit('SetMod', {});
                    client.emit('delMod', {'message': 'Success', 'reason': data.username + ' is not Mod anymore'});
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'DelMod error (user not found) !'});
                    console.log('Client DelMod error ! (user not found)');
                }
			}
		});
	}
}
