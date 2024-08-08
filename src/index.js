import { Client, IntentsBitField, Collection, Events } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import config from "./config.json" with { type: "json" };
const token = config.token;
import Enmap from "enmap";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.commands = new Collection();

//attach enmap to client
client.enmap = new Enmap({ name: "data"});
console.log(client.enmap.entries());

const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

//attach commands to client
for (const folder of commandFolders) {
	const commandsPath = join(foldersPath, folder);
	const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		let filePath = join(commandsPath, file);
		filePath = "file://" + filePath;
		const command = await import(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
	
//excecute command
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
		
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.on("ready", (c) => {
    console.log("Bot " + c.user.tag + " has successfully loaded");
});



client.login(token);