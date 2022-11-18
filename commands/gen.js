// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('../config.json');

// collections
const generated = new Set();
const GenTimes = [];
const GenCount = [];


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
	
	AllTimes: GenTimes,
	AllCount: GenCount,
    
    // command name
	name: 'gen',

    // command description
	description: 'Generates a specified service, if stocked.',

    // command
	execute(message) {

        // if gen channel
        if (message.channel.id === config.genChannel) {

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
                    .setDescription('You don\'t have any license redeemed! You can buy it from our admins!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                // cancel
                return;
            };
			
			if (generated.has(message.author.id)) {
				const d2 = new Date();
				const n2 = d2.getTime();
				const Remain = GenTimes[message.author.id] - n2
                // send message to channel
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Cooldown Remaining time: ' + msToTime(Remain))
                    .setDescription('Please wait before executing another command! Remaining time: ' + msToTime(Remain))
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                // cancel
                return;

            // if not generated before
            } else {

                // split message content
                const messageArray = message.content.split(' ');

                // args
                const args = messageArray.slice(1);

                // if the service is missing
                if (!args[0]) {

                    // send message to channel
                    message.channel.send(

                        // embed
                        new Discord.MessageEmbed()
                        .setColor(config.color.red)
                        .setTitle('Retard')
                        .setDescription('You need to provide a service name!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setTimestamp()
                    );

                    // cancel
                    return;
                };

                // stock files path
                const filePath = `${__dirname}/../stock/${args[0]}.txt`;

                // read the file
                fs.readFile(filePath, function (error, data) {

                    // if no error
                    if (!error) {

                        // text file content to string
                        data = data.toString();

                        // find position
                        const position = data.toString().indexOf('\n');

                        // find first line
                        const firstLine = data.split('\n')[0];

                        // if cannot find first line
                        if (position === -1) {

                            // send message to channel
                            message.channel.send(

                                // embed
                                new Discord.MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Gen error!')
                                .setDescription(`I can\'t find the \`${args[0]}\` service in my stock!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );

                            // cancel
                            return;
                        };

                        // send the embed and the copy-paste to the message author
                        message.author.send(

                            //embed
                            new Discord.MessageEmbed()
                            .setColor(config.color.green)
                            .setTitle('Generated account')
                            .addField('Service', `${args[0]}`)
                            .addField('Account/Data', `\`\`\`${firstLine}\`\`\``)
                            .setTimestamp()
                        );

                        // if the service generated successful (position)
                        if (position !== -1) {

                            // text file to string and change position
                            data = data.substr(position + 1);

                            // write file
                            fs.writeFile(filePath, data, function (error) {
								
								if (typeof GenCount[message.author.id] === 'undefined') {
								  GenCount[message.author.id] = 0
								}
								GenCount[message.author.id] += 1

                                // send message to channel
                                message.channel.send(

                                    // embed
                                    new Discord.MessageEmbed()
                                    .setColor(config.color.green)
                                    .setTitle('Account generated!')
                                    .setDescription(`Check your DMs ${message.author}! *If you don\'t receive a message, please unlock your DMs!*` + ' You can still make '+ (config.genCountToCoolDown - GenCount[message.author.id]) + '/' + config.genCountToCoolDown)
                                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                    .setTimestamp()
                                );

                                // add the message author to cooldown collection
								if (GenCount[message.author.id] >= config.genCountToCoolDown) {
									generated.add(message.author.id);
									const d = new Date();
									const n = d.getTime();

									GenTimes[message.author.id] = n + Number(config.genCooldown)

									// set cooldown (in millisec)
									setTimeout(() => {

										// remove the message author from cooldown collection after timeout
										generated.delete(message.author.id);
										GenTimes[message.author.id] = null
										GenCount[message.author.id] = 0
									}, config.genCooldown);
								}

                                // if error
                                if (error) {

                                    // write to console
                                    console.log(error);
                                };
                            });

                        // if no lines
                        } else {

                            // send message to channel
                            message.channel.send(

                                // embed
                                new Discord.MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Gen error!')
                                .setDescription(`I don\'t find any accounts in \`${args[0]}\` service!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );

                            // cancel
                            return;
                        };

                    // if error
                    } else {

                        // send message to channel
                        message.channel.send(

                            // embed
                            new Discord.MessageEmbed()
                            .setColor(config.color.red)
                            .setTitle('Gen error!')
                            .setDescription(`I don\'t find the \`${args[0]}\` service in my stock!`)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                            .setTimestamp()
                        );

                        // cancel
                        return;
                    };
                });
            };

        // if not gen channel
        } else {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Prohibited activity!')
                .setDescription(`You can only use the ${config.prefix}gen command in <#${config.genChannel}> channel!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	},
};