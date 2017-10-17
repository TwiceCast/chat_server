module.exports = {
	/*
	** PARAMETERS
	*/
	SERVER_PORT: '3006',
	API_URL: "api.twicecast.ovh",
	TEST_MODE_ENABLE: true,
    JWT_SECRET: 'supersecret',

    /*
    ** RIGHTS
    */
	RIGHTS: {
		ADMIN: 0,
		MOD: 1,
		VIP: 2,
		USER: 3,
        UNKNOW: -1
	},
	RANKS: {
		1: {'title': 'Administrator', 'description': 'The highest role', 'right': 0},
		2: {'title': 'Moderator', 'description': 'In charge of compliance with the TwiceCast\'s charter', 'right': 0},
		3: {'title': 'Guest', 'description': 'Normal user', 'right': 3},
		4: {'title': 'Founder', 'description': 'The creator of the organization', 'right': 0},
		5: {'title': 'Moderator', 'description': 'In charge of the respect of the rules of the organization', 'right': 1},
		6: {'title': 'Streamer', 'description': 'Member authorized to use the organization\'s streams to broadcast content', 'right': 1},
		7: {'title': 'Guest', 'description': 'Member of the organization having special rights for access to the organization\'s streams if it is private', 'right': 3},
		8: {'title': 'Founder', 'description': 'The creator of the stream', 'right': 0},
		9: {'title': 'Co-Streamer', 'description': 'A user authorized to use this stream as his own', 'right': 0},
		10: {'title': 'Moderator', 'description': 'User in charge of the respect of the rules of the stream, especially in the chat', 'right': 1},
		11: {'title': 'Contributor', 'description': 'Honorific rank for a viewer having contributed to the stream by proposing helpful code', 'right': 2},
		12: {'title': 'Guest', 'description': 'User having special rights for access to the stream if it\'s private', 'right': 3}
	}
}
