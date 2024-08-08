import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("init")
  .setDescription("adds this Channel to recieve Multiverse messages")
  .setDefaultMemberPermissions(0)
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("Role to be tagged in messages")
      .setRequired(true)
  )
  .setDMPermission(false)
  .setDefaultMemberPermissions(0);
export async function execute(interaction) {
  //Initialize Channel, by adding its ID to the channels.json file
  const channelID = String(interaction.channelId);

  const client = interaction.client;

  //get RoleId from Role object provided by the Role option
  //add necessary Syntax so the Role id will get interpreted as a role ping in a message sent by send.js
  const role = "<@&" + interaction.options.getRole("role").id + ">";

  //retrieve enmap that has been attached to the client
  const enmap = interaction.client.enmap;

  let updated = false;

  try {
    //make sure Channel type is a normal text channel
    if (client.channels.cache.get(channelID).type !== 0)
      throw new Error("Channel is not a normal text channel", { cause: 2 });

    if (!enmap.has(channelID)) {
      enmap.set(channelID, role);
    } else {
      if (enmap.get(channelID) !== role) {
        enmap.set(channelID, role);
        updated = true;
      } else {
        throw new Error("channel is already initialized", { cause: 1 });
      }
    }

    if (!updated) {
      console.log(`Channel ${channelID} added to enmap with ${role} as value`);
      await interaction.reply("Channel sucessfully initialized.");
    } else {
      console.log(`Channel role ${role} updated`);
      await interaction.reply("Channel role sucessfully updated.");
    }

    console.log(enmap.entries());
  } catch (error) {
    switch (error.cause) {
      case 1:
        await interaction.reply("channel is already initialized");
        break;

      case 2:
        await interaction.reply("channel is not a normal text channel");
        break;

      default:
        await interaction.reply("There was an unkown Error");
    }
    console.error(`Error adding element to enmap: ${error}`);
  }
}
