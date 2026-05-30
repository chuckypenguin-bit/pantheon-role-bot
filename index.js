const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!setuproles") {

    const embed = new EmbedBuilder()
      .setTitle("Pantheon Role Requests")
      .setDescription("Click a button below to request a role.");

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("request_member")
          .setLabel("Pantheon Member")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("request_ally")
          .setLabel("Pantheon Ally")
          .setStyle(ButtonStyle.Success)
      );

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on("interactionCreate", async (interaction) => {
if (!interaction.isButton()) return;

const logChannel = interaction.guild.channels.cache.get(
"1510243753359839362"
);

if (interaction.customId === "request_member") {

  const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId(`approve_member_${interaction.user.id}`)
      .setLabel("Approve")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`deny_${interaction.user.id}`)
      .setLabel("Deny")
      .setStyle(ButtonStyle.Danger)
  );

await logChannel.send({
  content: `${interaction.user.tag} requested Pantheon Member`,
  components: [row]
});

  await interaction.reply({
    content: "Your request has been sent to server admins.",
    ephemeral: true
  });

}

if (interaction.customId === "request_ally") {

  const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId(`approve_ally_${interaction.user.id}`)
      .setLabel("Approve")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`deny_${interaction.user.id}`)
      .setLabel("Deny")
      .setStyle(ButtonStyle.Danger)
  );

await logChannel.send({
  content: `${interaction.user.tag} requested Pantheon Ally`,
  components: [row]
});

  await interaction.reply({
    content: "Your request has been sent to server admins.",
    ephemeral: true
  });

}

});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith("approve_member_")) {

    const userId = interaction.customId.replace(
      "approve_member_",
      ""
    );

    const member =
      await interaction.guild.members.fetch(userId);

    await member.roles.add("1508214335145644113");

await member.send(
  "Your Pantheon Member request has been approved. Welcome to Pantheon."
);


await member.roles.remove(
  "1510041376010534953"
);

    await interaction.update({
      content: `Approved Pantheon Member for ${member.user.tag}`,
      components: []
    });
  }

  if (interaction.customId.startsWith("approve_ally_")) {

    const userId = interaction.customId.replace(
      "approve_ally_",
      ""
    );

    const member =
      await interaction.guild.members.fetch(userId);

   await member.roles.add("1508220770768261181");

await member.send(
  "Your Pantheon Ally request has been approved. Welcome to Pantheon."
);

await member.roles.remove(
  "1510041376010534953"
);

    await interaction.update({
      content: `Approved Pantheon Ally for ${member.user.tag}`,
      components: []
    });
  }

 if (interaction.customId.startsWith("deny_")) {

  const userId = interaction.customId.replace("deny_", "");

  const member =
    await interaction.guild.members.fetch(userId);

  await member.send(
    "Your Pantheon role request has been denied."
  );

  await interaction.update({
    content: `Denied request for ${member.user.tag}`,
    components: []
  });
}

});

client.login(config.token);