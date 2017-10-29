const utils = require('../utils');
const config = require('../config');
const events = require('../events');

module.exports = {
	RegisterEvent: function(client) {
		client.on('deleteMessage', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client deleteMessage error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.DeleteMessageProperties, events.DLETE_MESSAGE_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'Message syntax error !'});
				console.log("Client deleteMessage error ! (Properties)");
			}
			else if (client.rank > config.RIGHTS.MOD || client.rank == config.RIGHTS.UNKNOW) {
				client.emit('cerror', {'code': 401, 'message': 'Unauthorized'});
				console.log("Client deleteMessage error ! (Rights)");
			}
			else
			{
				client.to(client.room).emit('deleteMessage', data); // emit message to all client except sender
				client.emit('deleteMessage', data); // emit to sender (proof of receive)
			}
		});
	}
}
