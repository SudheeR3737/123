// require Nuggies
const Nuggies = require('nuggies');
const Discord = require('discord.js');
/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {String[]} args
 */

module.exports.run = async (client, message, args) => {
	const brmanager = new Nuggies.buttonroles();
	message.channel.send('Send messages in `roleID color label emoji` syntax! Once finished say `done`.');

	/**
	 * @param {Discord.Message} m
	 */
	const filter = m => m.author.id === message.author.id;
	const collector = message.channel.createMessageCollector(filter, { max: Infinity });

	collector.on('collect', async (msg) => {
		if (!msg.content) return message.channel.send('Invalid syntax');
		if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');
		const colors = ['grey', 'gray', 'red', 'blurple', 'green'];
		if (!msg.content.split(' ')[0].match(/[0-9]{18}/g) || !colors.includes(msg.content.split(' ')[1])) return message.channel.send('Invalid syntax');

		const role = msg.content.split(' ')[0];
		// const role = message.guild.roles.cache.get(roleid);
		if (!role) return message.channel.send('Invalid role');

		const color = colors.find(color => color == msg.content.split(' ')[1]);
		if (!color) return message.channel.send('Invalid color');

		const label = msg.content.split(' ').slice(2, msg.content.split(' ').length - 1).join(' ');

		const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

		const final = {
			role, color, label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
		};
		brmanager.addrole(final);
	})

	collector.on('end', async (msgs, reason) => {
		if (reason == 'DONE') {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Select Self Roles By Clicking On These Buttons!','https://media.discordapp.net/attachments/899221577567186964/910855272342356008/discord-avatar-128-EXWE7-1.gif')
    .setThumbnail("https://media.discordapp.net/attachments/899221577567186964/910855272342356008/discord-avatar-128-EXWE7-1.gif")
				.setDescription(`<:Alex_outages:914362383248523264> <@&914383385252728862> (To get notified when there is any outages in <@898555944026386462>'s!)\n\n<:alex_updates:914487629595160668> <@&914383831367315496> (To get notified about <@898555944026386462>'s new updates)\n\n<a:Alex_online:914363258092257290> <@&914486508549996574> (To get notified about <@898555944026386462>'s)\n\n<:Alex_announce:914362273936584724> <@&914383468635508786> (To get important announcements of server/bot)\n\n <:updatess_Alex:914362097306058762> <@&914383647719694356> (To get notified for server related updates!)\n\n<a:Alex_poll:914362512361791498> <@&914383717617786901> (To get notified for polls)`)
        .setFooter("Thanks For Choosing Alex Bots")
				.setColor('#303037')
				.setTimestamp();
			Nuggies.buttonroles.create({ message, content: embed, role: brmanager, channelID: message.channel.id })
		}
	})
};

module.exports.config = {
	name: 'create-br',
	description: 'Creates button role!',
	usage: '?create-br',
	botPerms: [],
	userPerms: ['MANAGE_GUILD'],
	aliases: [],
};