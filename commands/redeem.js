// npmjs packages
const Discord = require('discord.js');

const fs = require('fs');

// configuration
const config = require('../config.json');

const Users = require('../db/users.json');

function SaveUsers() {
	const filePath = `${__dirname}/../db/users.json`;
	// write file
	var jsonContent = JSON.stringify(Users);
	fs.writeFile(filePath, jsonContent, function (error) {
		// if error
		if (error) {
			// write to console
			console.log(error);
		};
	});
}

function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return d + " Days and "+ pad(h) +":"+ pad(m);
}

// export command
module.exports = {
    
	GetAllUsers() {
		return Users
	},
	
	RemoveUser(id) {
		Users[id] = undefined
		SaveUsers()
	},
	
	CanUserGen(id) {
		const d2 = new Date();
		const Now = d2.getTime();
		if (typeof Users[id] !== 'undefined') {
			const Diff = Number(Users[id]) - Now
			if (Diff > 1000) {
				return true;
			} else { 
				return false;
			};
		} else {
			return false;
		};
	},
	
	GetUserExpireTime(id) {
		const d2 = new Date();
		const Now = d2.getTime();
		if (typeof Users[id] !== 'undefined') {
			return Users[id];	
		} else {
			return Now;
		};
	},

    // command name
	name: 'redeem',

    // command description
	description: 'Redeems NurixGen',

    // command
	execute(message) {
        // if gen channel
        if (message.channel.id === config.KeyredeemChannel) {
		
			// split message content
			const messageArray = message.content.split(' ');

			// args
			const args = messageArray.slice(1);
			
			var Key = null;
			// if the service is missing
			if (args[0]) {
				const AllKeys = require('./genkey.js').AllKeys;
				var SelectedKey = AllKeys[args[0]]
				if (SelectedKey) {
					
					const d2 = new Date();
					const Now = d2.getTime();
					if (typeof Users[message.author.id] === 'undefined') {
					  Users[message.author.id] = Now
					}
					Users[message.author.id] += Number(SelectedKey)

					// send message to channel
					message.channel.send(

						// embed
						new Discord.MessageEmbed()
						.setColor(config.color.green)
						.setTitle('Redeemed Successfully!')
						.setDescription(`Key have been successfully redeemed! Expires in: \n` + dhm(Users[message.author.id] - Now ) + ` `)
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
						.setTimestamp()
					);
					const User = message.guild.members.cache.find(user => user.id === (message.author.id).toString())
					User.roles.add((config.genRole).toString());
          User.roles.add((config.customerRole).toString());
					
					require('./genkey.js').RemoveKey(args[0]);
					SaveUsers();
				} else {
					// send message to channel
					message.channel.send(
						// embed
						new Discord.MessageEmbed()
						.setColor(config.color.red)
						.setTitle('retard')
						.setDescription('**Entered key is invalid. Please try using a valid key!**')
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
						.setTimestamp()
					);
					// cancel
					return;
				};
			} else {
				// send message to channel
				message.channel.send(
					// embed
					new Discord.MessageEmbed()
					.setColor(config.color.red)
					.setTitle('Missing Something')
					.setDescription('You need to enter a **valid** license key! Example: ``!redeem GO-BUY-ZEYROX-GEN``')
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
					.setTimestamp()
				);
				// cancel
				return;
			};
        // if not gen channel
        } else {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('retard')
                .setDescription(`You can only use the ${config.prefix}redeem command in <#${config.KeyredeemChannel}> channel!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	},

};