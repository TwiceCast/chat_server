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
				data.user = client.username;
				client.to(client.room).emit('message', data); // emit message to all client except sender
				client.emit('message', data); // emit to sender (proof of receive)
			}
		});
	}
}
