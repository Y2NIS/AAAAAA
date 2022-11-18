// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('../config.json');

// export command
module.exports = {
    
    // command name
	name: 'stock',

    // command description
	description: 'Checks our services stock.',

    // command
	execute(message) {
		// load commands
		const AllStocks = fs.readdirSync(`${__dirname}/../stock`).filter(file => file.endsWith('.txt'));
		var TXT = ''
		// const commands
		for (const Stock of AllStocks) {
			// stock files path
			const filePath = `${__dirname}/../stock/${Stock}`;

			// lines
			let lines = [];

			// file to read
			var fileContents;

			// try to read file
			try {

				// read file
				fileContents = fs.readFileSync(filePath, 'utf-8')

			// if error
			} catch (error) {
			};

			// get lines
			fileContents.split(/\r?\n/).forEach(function (line) {

				// push lines
				lines.push(line);
			});
			StockName = Stock.replace('.txt','')
			TXT = TXT + '\n' + `\`${StockName}\ service has \`${lines.length}\ accounts.`

		};


        message.channel.send(
            new Discord.MessageEmbed()
            .setColor(config.color.default)
            .setTitle(`Current Accounts Stock`)
            .setDescription(TXT)
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
        );
    },
};