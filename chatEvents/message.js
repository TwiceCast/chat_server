const utils = require('../utils');
const events = require('../events');

module.exports = {
	RegisterEvent: function(client) {
		client.on('message', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client message error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.MessageProperties, events.MESSAGE_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'Message syntax error !'});
				console.log("Client message error ! (Properties)");
			}
			else
			{
                if (client.isMuted && Date.now() <= client.muteDate + client.muteDuration * 1000) {
                    client.emit('mute', {'duration': (client.muteDuration * 1000 - (Date.now() - client.muteDate)) / 1000});
                } else {
					data.id = Math.floor((Math.random() * 1000000));
				    data.user = client.username;
                    data.displayName = client.displayedName;
					data.rank = client.rank;
				    client.to(client.room).emit('message', data); // emit message to all client except sender
				    client.emit('message', data); // emit to sender (proof of receive)
                    if (client.isMuted) {
                        client.isMuted = false;
                        client.muteDuration = 0;
                    }
                }
			}
		});
	}
}
