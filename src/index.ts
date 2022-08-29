import * as dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";

// ---------------------
// Environment Variables
// ---------------------
const DISCORD_BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(DISCORD_BOT_TOKEN);
