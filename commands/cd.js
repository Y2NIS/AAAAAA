// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('../config.json');

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

// export command
module.exports = {
    
    // command name
	name: 'cd',

    // command description
	description: 'Check your account cooldown',

    // command
	execute(message) {

        // if gen channel
        if (message.channel.id === config.genChannel) {
			const GenTimes = require('./gen.js').AllTimes;
			const GenCount = require('./gen.js').AllCount;
			
			const CanMake = require('./redeem.js').CanUserGen(message.author.id);
            if (!CanMake) {
				const d2 = new Date();
				const n2 = d2.getTime();
				const Remain = GenTimes[message.author.id] - n2
                // send message to channel
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Invalid license')
                    .setDescription('You don\'t have any license redeemed! You can buy it from our resellers!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                // cancel
                return;
            };
            // if generated before
            // if (generated.has(message.author.id)) {
				if (typeof GenCount[message.author.id] === 'undefined') {
				  GenCount[message.author.id] = 0
				}
				
				var Remain = 'Not in Cooldown Time'
				
				if (typeof GenTimes[message.author.id] !== 'undefined') {
					const d2 = new Date();
					const n2 = d2.getTime();
					const RemainTime = GenTimes[message.author.id] - n2
					Remain = msToTime(RemainTime)
				};
				
                // send message to channel
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Cooldown')
                    .setDescription('Currently you can generate: '+ (config.genCountToCoolDown - GenCount[message.author.id]) + '/' + config.genCountToCoolDown + ' \nRemaining time for more accounts: ' + Remain)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                // cancel
                return;
			// };

        // if not gen channel
        } else {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Prohibited activity!')
                .setDescription(`You can only use the ${config.prefix}cooldown command in <#${config.genChannel}> channel!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	},
};