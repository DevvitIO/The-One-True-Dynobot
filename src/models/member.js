const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
	_id: String,
	username: String,
	tag: String,
	avatarURL: String,
	cookies: [
		{
			messageId: String,
			date: Date,
			senderId: String
		}
	]
});

module.exports = mongoose.model('Member', memberSchema);
