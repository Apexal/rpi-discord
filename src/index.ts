import * as dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import { generateRoleModal, generateRoleButtonActionRow } from "./interactions";
import { roles } from "./roles";
import { sendVerificationEmail } from "./email";

// ---------------------
// Environment Variables
// ---------------------
const DISCORD_BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;

  // Construct welcome message with buttons to select role

  const row = generateRoleButtonActionRow(roles);
  member.send({
    content:
      "Welcome to the RPI ITWS Discord server! Please select the role that best describes you.",
    components: [row],
  });
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const row = generateRoleButtonActionRow(roles);
  message.author.send({
    content:
      "Welcome to the RPI ITWS Discord server! Please select the role that best describes you.",
    components: [row],
  });
});

/** Handle role button selections. Opens the corrent modal based on the role. */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  console.log(interaction);

  const selectedRole = roles.find(
    (role) => "am-" + role.customId === interaction.customId
  );

  if (selectedRole) {
    const modal = generateRoleModal(selectedRole);
    await interaction.showModal(modal);
    await sendVerificationEmail(
      selectedRole,
      "Frank Matranga",
      "frank@matranga.family",
      "abc123"
    );
  }
});

client.login(DISCORD_BOT_TOKEN);
