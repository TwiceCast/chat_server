module.exports = {
	// Event parameter strictness
	AUTH_STRICT: true,
	MESSAGE_STRICT: true,
	DELETE_MESSAGE_STRUCT: true,
	SET_TEST_MODE_STRICT: true,
    KICK_STRICT: true,
    MUTE_STRICT: true,
    BAN_STRICT: true,
    SET_MOD_STRICT: true,
    DEL_MOD_STRICT: true,
	
	// Event mandatory parameters
	AuthProperties: ['username', 'password', 'room'],
	MessageProperties: ['content'],
	DeleteMessageProperties: ['id'],
	SetTestModeProperties: ['value'],
    KickProperties: ['username'],
    MuteProperties: ['username', 'duration'],
    BanProperties: ['username'],
    SetModProperties: ['username'],
    DelModProperties: ['username']
}
