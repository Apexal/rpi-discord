import * as dotenv from "dotenv";
dotenv.config();

import {
  Client,
  GatewayIntentBits,
  InteractionType,
  Partials,
  User,
} from "discord.js";
import { generateRoleModal, generateRoleButtonActionRow } from "./interactions";
import { roles } from "./roles";
import { sendVerificationEmail } from "./email";
import { keyv, UserCache } from "./cache";
import { verifyRPIUser } from "./discord";

// ---------------------
// Environment Variables
// ---------------------
const DISCORD_BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

/** When a user first joins the server, send them a welcome message and ask them to select a role. */
client.on("guildMemberAdd", (member) => {
  const row = generateRoleButtonActionRow(roles);
  member.send({
    content:
      "Welcome to the RPI ITWS Discord server! Please select the role that best describes you.",
    components: [row],
  });
});

/** When a user selects a role button, opens the correct form modal to gather their details. */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // Attempt to find role, no guarantee it is found
  const selectedRole = roles.find(
    (role) => "am-" + role.customId === interaction.customId
  );

  if (selectedRole) {
    const modal = generateRoleModal(selectedRole);
    await interaction.showModal(modal);
  } else {
    console.warn(`User pressed an unknown button`, { interaction });
  }
});

/** When a user submits their role form modal, start the verification process for them. */
client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isModalSubmit() ||
    interaction.type !== InteractionType.ModalSubmit
  )
    return;

  const fullName = interaction.fields.getTextInputValue("full-name");

  if (
    interaction.customId === "current-rpi-student-modal" ||
    interaction.customId === "current-rpi-faculty-modal"
  ) {
    const rpiEmail = interaction.fields.getTextInputValue("rpi-email");
    const rpiUsername = rpiEmail.replace("@rpi.edu", "");

    const verificationCode = Math.random().toString(36).slice(6);
    const role = roles.find(
      (role) => role.customId + "-modal" === interaction.customId
    );

    if (!role) return;

    const userCache: UserCache = {
      userRoleCustomId: role.customId,
      discordUserId: interaction.user.id,
      rpiUsername,
      fullName,
      verificationCode,
    };

    if (role.customId === "current-rpi-student") {
      userCache.graduationYear =
        interaction.fields.getTextInputValue("graduation-year");
    }

    try {
      // Store user details in the cache
      await keyv.set(interaction.user.id, userCache);
      console.log(userCache);
    } catch (error) {
      console.error("Failed to store user cache", {
        error,
        userCache,
      });
      return;
    }

    try {
      // await sendVerificationEmail(role, fullName, rpiEmail, verificationCode);
    } catch (error) {
      console.error("Failed to send verification email", {
        error,
        userCache,
      });
      return;
    }

    try {
      await interaction.reply({
        content: `Thanks, ${fullName}! Check **${rpiEmail}** for the verification code and simply copy/paste it here to finish.`,
      });
    } catch (error) {
      console.warn("Failed to send thank you message", {
        error,
        userCache,
      });
    }
  }
});

client.on("messageCreate", async (message) => {
  // Check if user is verifying
  const userCache = (await keyv.get(message.author.id)) as UserCache;
  if (!userCache) return;

  const messageCleaned = message.content.trim().toLowerCase();

  if (
    userCache.verificationCode &&
    messageCleaned.includes(userCache.verificationCode.toLowerCase())
  ) {
    if (
      userCache.userRoleCustomId === "current-rpi-student" ||
      userCache.userRoleCustomId === "current-rpi-faculty"
    ) {
      verifyRPIUser(userCache);
    }

    console.log("Successfully verified " + message.author.username);
    await message.reply({
      content:
        "Successfully verified! You now have access to the ITWS Discord server.",
    });
    await keyv.delete(message.author.id);
  }
});

client.login(DISCORD_BOT_TOKEN);
