import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("send")
  .setDescription("Sends message to the Multiverse")
  .addStringOption(option => option.setName("message")
    .setDescription("The message to be sent")
    .setRequired(true))
    .setDMPermission(false)
  .setDefaultMemberPermissions(0);
export async function execute(interaction) {
  const messageContent = interaction.options.getString("message");
  const client = interaction.client;
  const enmap = client.enmap;
  const targetChannelIds = enmap.keys(); //get channels Array from enmap

  let reply = "";
  for (const channelId of targetChannelIds) {
    try {

      const channel = client.channels.cache.get(channelId);

      // Ensure the channel exists and is a text channel (already checked in init.js but better be safe than sorry)
      if (channel && channel.type === 0) {

        //send the message with the roleId belonging to the channel
        await channel.send(enmap.get(channelId) + `\n` + messageContent);

        reply += `Message sent to channel: ${channel.name} in ${channel.guild.name}\n-------------\n`;

      } else {

        enmap.delete(channelId);
        reply += `Channel not found or not a text channel: ${channelId}\nit has been removed from the multiverse \n-------------\n`;

      }
    } catch (error) {

      console.error(`Error sending message to channel ${channelId}:`, error);

    }
  }

  //last line of "-------" get removed
  await interaction.reply(reply.slice(0, reply.lastIndexOf("-") - 12));

}
