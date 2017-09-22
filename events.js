module.exports = {
	// Event parameter strictness
	AUTH_STRICT: true,
	MESSAGE_STRICT: true,
	SET_TEST_MODE_STRICT: true,
    KICK_STRICT: true,
    MUTE_STRICT: true,
	
	// Event mandatory parameters
	AuthProperties: ['username', 'password', 'room'],
	MessageProperties: ['content'],
	SetTestModeProperties: ['value'],
    KickProperties: ['username'],
    MuteProperties: ['username', 'duration']
}
