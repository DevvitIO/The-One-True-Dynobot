const Member = require('../models/member');

const createReactionHandler = cb => async (reaction, discordSender) => {
	const discordReceiver = reaction.message.author;

	if (reaction.emoji.name === '🍪' && discordSender.id !== discordReceiver.id) {
		let discordMembers = [discordSender, discordReceiver];

		let members = await Promise.all(
			discordMembers.map(user => Member.findById(user.id))
		);

		members = members.map((member, i) => {
			const { id, tag, username, displayAvatarURL } = discordMembers[i];
			return (
				member ||
				new Member({
					_id: id,
					tag,
					username,
					avatarURL: displayAvatarURL,
					cookies: []
				})
			);
		});

		await cb(reaction, members);

		members.map(member => member.save());
	}
};

module.exports = client => {
	client.on(
		'messageReactionAdd',
		createReactionHandler((reaction, [sender, receiver]) => {
			receiver.cookies.push({
				messageId: reaction.message.id,
				date: new Date(Date.now()),
				senderId: sender._id
			});
		})
	);
	client.on(
		'messageReactionRemove',
		createReactionHandler((reaction, [sender, receiver]) => {
			const i = receiver.cookies.findIndex(
				cookie => cookie.messageId === reaction.message.id
			);
			if (i < 0) {
				return;
			}

			receiver.cookies.splice(i, 1);
		})
	);
};
