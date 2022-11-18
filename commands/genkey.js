const Discord = require('discord.js');
const fs = require('fs');

const config = require('../config.json');

const keys = require('../db/keys.json');

const KeyGen = require('../KeyGenerator.js');

const PossibleTimes = {week : 604800000,month : 2592000000,lifetime : 63072000000000};

function SaveKeys() {
	const filePath = `${__dirname}/../db/keys.json`;
	var jsonContent = JSON.stringify(keys);
	fs.writeFile(filePath, jsonContent, function (error) {
		if (error) {
			console.log(error);
		};
	});
}
module.exports = {
	AllKeys : keys,
    
	RemoveKey(Key) {
		if (typeof keys[Key] !== 'undefined') {
			keys[Key] = undefined
			SaveKeys()
		};
	},

    
	name: 'genkey',
	description: 'for my mom',

    
	execute(message) {
        
        
		    if (message.member.hasPermission(["ADMINISTRATOR"])) {
			
			const messageArray = message.content.split(' ');

			
			const args = messageArray.slice(1);
			
			var Key = null;
			
			if (args[0]) {
				var SelectedTime = PossibleTimes[args[0]]
				if (SelectedTime) {
					
					while(true){
						Key = KeyGen.generate();
						if (typeof keys[Key] === 'undefined') {
							keys[Key] = SelectedTime
							break;
						};
					}

					message.author.send(

						
						new Discord.MessageEmbed()
						.setColor('BLUE')
						.setTitle('License Key Generated')
						.addField('Time', `${args[0]}`)
						.addField('Key', `||${Key}||`)
						.setTimestamp()
					);

					
					message.channel.send(


						new Discord.MessageEmbed()
						.setColor('BLUE')
						.setTitle('Key generated!')
						.setDescription(`Check your DMs ${message.author}! *If you don\'t recieved the message, please unlock your DMs!*`)
						.setFooter(`Requested by ${message.author.username}#${message.author.discriminator} `, message.author.displayAvatarURL())
						.setTimestamp()
					);
					SaveKeys();
				}
				} else {
					
					message.channel.send(

						new Discord.MessageEmbed()
						.setColor('BLUE')
						.setTitle('U fucking dumbass')
						.setDescription('You need to give a correct license expiration time! ``week`` - ``month`` - ``lifetime``')
						.setFooter(`Requested by ${message.author.username}#${message.author.discriminator}  `, message.author.displayAvatarURL())
						.setTimestamp()
					);
					
					return;
				};
			} else {

				
				message.channel.send(
					new Discord.MessageEmbed()
					.setColor('BLUE')
					.setTitle('U fucking dumbass')
					.setDescription('You need to give a correct license expiration time! ``week`` - ``month`` - ``lifetime``')
					.setFooter(`Requested by ${message.author.username}#${message.author.discriminator} `, message.author.displayAvatarURL())
					.setTimestamp()
				);
        
        };
	},

};