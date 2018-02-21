const Member = require('../models/member');

const createReactionHandler = cb => async reaction => {
	if (reaction.emoji.name === '🍪') {
		const user = reaction.message.author;

		let member = await Member.findById(user.id);

		if (!member) {
			member = new Member({
				_id: user.id,
				tag: user.tag,
				username: user.username,
				avatarURL: user.displayAvatarURL,
				cookies: []
			});
		}

		await cb(reaction, member);

		member.save();
	}
};

module.exports = client => {
	client.on(
		'messageReactionAdd',
		createReactionHandler((reaction, member) => {
			member.cookies.push({
				messageId: reaction.message.id,
				date: new Date(Date.now())
			});
		})
	);
	client.on(
		'messageReactionRemove',
		createReactionHandler((reaction, member) => {
			const i = member.cookies.findIndex(
				cookie => cookie.messageId === reaction.message.id
			);
			if (i < 0) {
				return;
			}

			member.cookies.splice(i, 1);
		})
	);
};
