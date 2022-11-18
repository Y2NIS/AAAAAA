// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('./config.json');

// create client
const client = new Discord.Client();



// const commands
client.commands = new Discord.Collection();

// load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// const commands
for (const file of commandFiles) {

    // read command file
	const command = require(`./commands/${file}`);

    // set the command
	client.commands.set(command.name, command);
};

// login with token
client.login(config.token)

// ready event
client.once('ready', () => {

    // write to console
	console.log(`I am logged in as ${client.user.tag} to Discord!`);

    // set activity
    let activities = [`NURIX GEN`, `.help`]
    setInterval(() => {
        let activity = activities[Math.floor(Math.random() * activities.length)]
        client.user.setActivity(activity, { type: "WATCHING"})
    }, 5000)

	setInterval(() => {
		const SV = client.guilds.cache.get(config.ServerId)
		const d2 = new Date();
		const Now = d2.getTime();
		const Users = require('./commands/redeem.js').GetAllUsers();
		for (const [id, value] of Object.entries(Users)) {
			const Diff = Number(Users[id]) - Now
			console.log(id,Diff);
			if (Diff < 1000) {
				const User = SV.members.cache.find(user => user.id === (id).toString())
				if (User) {
					if (User.roles.cache.has((config.genRole).toString())) {
						User.roles.remove((config.genRole).toString());
					};
				};
				require('./commands/redeem.js').RemoveUser(id);
			};
		}
	}, 10000);
});

client.on('guildMemberAdd', member => {
    if (member.user.bot) return;
    const dm = new Discord.MessageEmbed()
    .setColor('blue')
    .setTitle(`Welcome to ${member.guild.name}!`)
    .setDescription(`**[EN] Hello <@${member.id}>! To purchase, please make a ticket**`)
    member.send(dm)
});

// message event // command handling
client.on('message', (message) => {
    // command without prefix
	if (!message.content.startsWith(config.prefix)) {
        // cancel
        return;
    };
    // if a bot execute a command
	if (message.author.bot) {
        // cancel
        return;
    };

    // get the args
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);

    // const command
	const command = args.shift().toLowerCase();

    // if not match
	if (!client.commands.has(command)) {

        // send message to channel
        message.channel.send(
            
            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('retard')
            .setDescription(`Sorry, but no command exists with the name \`${command}\`!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );

        // cancel
        return;
    };

    // try to executing the command
	try {

        // get command
		client.commands.get(command).execute(message, args);

    // if error
	} catch (error) {

        // write to console
		console.error(error);

        // send message to channel
		message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('ERROR!')
            .setDescription(`An error occurred in \`${command}\` command!`)
            .addField('Error', `\`\`\`js\n${error}\n\`\`\``)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	};
});