import { Client, IntentsBitField, Collection, Events } from "discord.js";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import Enmap from "enmap";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./config.json");
const token = config.token;

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
client.enmap = new Enmap({ name: "data" });

// Funktion zum rekursiven Laden der Commands
function loadCommands(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = statSync(filePath);

    if (fileStat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js')) {
      (async () => {
        const command = await import("file://" + filePath);
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      })();
    }
  }
}

// Commands aus dem commands-Verzeichnis laden
loadCommands(join(__dirname, 'commands'));

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

client.on("ready", async () => {
  console.log("Bot " + client.user.tag + " has successfully loaded");

  // Globale Slash Commands registrieren
  try {
    await client.application.commands.set(client.commands.map(cmd => cmd.data));
    console.log("Global Slash Commands registered!");
  } catch (error) {
    console.error("Failed to register global Slash Commands:", error);
  }
});

process.on("SIGINT", () => {
  console.log("Bot shutting down...");
  client.destroy();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Bot received terminate signal...");
  client.destroy();
  process.exit(0);
});

client.login(token);