// Imports
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

// Moderation commands module
module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("The basic Discord moderator's kit.")

    // Kick command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Boot someone out of the server.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to be kicked")
            .setRequired(true)
        )
    )

    // Ban command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("Ban hammer activated and ready to bonk.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to be banned")
            .setRequired(true)
        )
    )

    // Unban command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unban")
        .setDescription("You have been un-bonked by the hammer.")
        .addUserOption((option) =>
          option
            .setName("id")
            .setDescription("User ID to be unbanned")
            .setRequired(true)
        )
    )

    // Warn command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warn")
        .setDescription("Warn someone.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to be warned")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === "ban") {
      const user = interaction.options.getUser("user");

      if (
        user &&
        interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
      ) {
        interaction.guild.members.ban(user);
        await interaction.reply(`:loudspeaker: ${user} has been banned.`);
      } else {
        await interaction.reply({
          content: ":space_invader: Oops! An error occured.",
          ephemeral: true,
        });
      }
    }

    if (interaction.options.getSubcommand() === "kick") {
      const member = interaction.options.getMember("user");

      if (
        member &&
        interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
      ) {
        member.kick();
        await interaction.reply(`:loudspeaker: ${member} has been kicked.`);
      } else {
        await interaction.reply({
          content: ":space_invader: Oops! An error occured.",
          ephemeral: true,
        });
      }
    }

    if (interaction.options.getSubcommand() === "unban") {
      const id = interaction.options.get("id")?.value;
      const user = interaction.options.getUser("id");

      if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        interaction.guild.members.unban(id);
        await interaction.reply(`:loudspeaker: ${user} has been unbanned.`);
      } else {
        await interaction.reply({
          content: ":space_invader: Oops! An error occured.",
          ephemeral: true,
        });
      }
    }

    if (interaction.options.getSubcommand() === "warn") {
      const id = interaction.options.get("id")?.value;
      const user = interaction.options.getUser("id");

      // Warning users with roles
      // warning1, warning2, warning3
      // if user has warningn, remove warningn and add warningn+1
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
        if (user.roles.cache.some(role => role.name === "warning1")) {
          user.roles.remove("warning1");
          user.roles.add("warning2");
          await interaction.reply(`:loudspeaker: ${user} has been warned the second time.`);
        }
        if (user.roles.cache.some(role => role.name === "warning2")) {
          user.roles.remove("warning2");
          user.roles.add("warning3");
          await interaction.reply(`:loudspeaker: ${user} has been will be banned.`);
          if (interaction.member.BAN_MEMBERS) {
            user.ban();
            await interaction.reply(`:loudspeaker: ${user} has been banned.`);
          }
          if (!(user.roles.cache.some(role => role.name.startsWith("warning")))) {
            user.roles.add("warning1");
            await interaction.reply(`:loudspeaker: ${user} has been warned the first time.`);
          }
        }
      }
    }
  }
}