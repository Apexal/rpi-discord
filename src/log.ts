import { ChannelType, MessageOptions, MessagePayload } from "discord.js";
import { client } from ".";

const DISCORD_SERVER_LOG_CHANNEL_ID =
  process.env.DISCORD_SERVER_LOG_CHANNEL_ID!;

/** Send a message to the Discord channel marked for logs. */
export async function serverLog(
  message: string | MessagePayload | MessageOptions
) {
  try {
    const channel = await client.channels.fetch(DISCORD_SERVER_LOG_CHANNEL_ID);
    if (!channel) {
      // TODO
      return null;
    }
    if (channel?.type === ChannelType.GuildText) {
      return await channel.send(message);
    }
  } catch (error) {
    console.warn("Failed to server log message", { message, error });
    return null;
  }
  return null;
}
