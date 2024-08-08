import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("remove this channel from the Multiverse")
  .setDMPermission(false)
  .setDefaultMemberPermissions(0);
export async function execute(interaction) {
  const channelID = String(interaction.channelId);

  const enmap = interaction.client.enmap;

  //delete a channel from the enmap duh
  try {
    if (enmap.has(channelID)) {
      enmap.delete(channelID);
    } else {
      throw new Error("channel not initialized", { cause: 16 });
    }

    console.log(`Element "${channelID}" removed successfully from enmap!`);
    await interaction.reply("Channel sucessfully removed.");
  } catch (error) {
    if (error.cause === 16) {
      await interaction.reply("channels is not in the Multiverse");
    } else {
      await interaction.reply("There was an unkown Error");
    }
    console.error(
      `Error removing element "${channelID}" from enmap: ${error}`
    );
  }
}
