module.exports = {
	
	clients: [],
  
	AddClient: function(socket) {
		if (socket in this.clients) {
			return false;
		} else {
			this.clients.push(socket);
			return true;
		}
	},
	
	GetClientsInRoom: function(room) {
		var res = [];
		this.clients.forEach(function(elem) {
			if (elem.room == room) {
				res.push(elem);
			}
		});
		
		return res;
	},
	
	RemoveClient: function(socket) {
		if (socket in this.clients) {
			var id = this.clients.indexOf(socket);
			this.clients.splice(id, 1);
		}
	}
}
