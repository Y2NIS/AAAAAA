// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('../config.json');

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
    
    // command name
	name: 'expiration',

    // command description
	description: 'expiration',

    // command
	execute(message) {
        // if gen channel
        if (message.channel.id === config.CheckExpireChannel) {
			const d2 = new Date();
			const Now = d2.getTime();
			const EXP = require('./redeem.js').GetUserExpireTime(message.author.id);
			const EXPTime = Number(EXP) - Now
			message.channel.send(

				// embed
				new Discord.MessageEmbed()
				.setColor(config.color.green)
				.setTitle('License expiration time!')
				.setDescription(`You Have ` + dhm(EXPTime) + ` hours left`)
				.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
				.setTimestamp()
			);
        // if not gen channel
        } else {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('U fucking retard')
                .setDescription(`You can only use the ${config.prefix}expiration command in <#${config.CheckExpireChannel}> channel!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	},

};