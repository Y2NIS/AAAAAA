// npmjs packages
const Discord = require('discord.js');

// configuration
const config = require('../config.json');

// export command
module.exports = {
    
    // command name
	name: 'help',

    // command description
	description: 'Lists all commands.',

    // command
	execute(message) {

        // const commands
		const { commands } = message.client;

    //dm 
    message.channel.send(`${message.author} I've sent you a DM with all my commands!`);

        // send message to channel
       message.member.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.default)
            .setTitle('Nurix Products - Help Menu')
            .setDescription(commands.map(c => `\`${config.prefix}${c.name}\` - \`${c.description ? c.description : 'No description provided!'}\``).join('\n'))
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	},
};