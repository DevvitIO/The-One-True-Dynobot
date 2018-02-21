const schedule = require('node-schedule');
const Member = require('../models/member');

module.exports = client => {
	const scrape = () => {
		const members = client.guilds.array()[0].members.array();

		members.map(async member => {
			const user = member.user;

			let dbMember = await Member.findById(user.id);

			if (!dbMember) {
				dbMember = new Member({
					_id: user.id,
					cookies: []
				});
			}

			dbMember.tag = user.tag;
			dbMember.username = user.username;
			dbMember.avatarURL = user.displayAvatarURL;

			dbMember.save();
		});

		console.log(`Scraped ${members.length} members`);
	};

	scrape();
	schedule.scheduleJob('*/30 * * * *', scrape);
};
