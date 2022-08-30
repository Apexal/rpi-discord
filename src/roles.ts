import { ButtonStyle, ComponentEmojiResolvable } from "discord.js";

const DISCORD_SERVER_VERIFIED_ROLE_ID =
  process.env.DISCORD_SERVER_VERIFIED_ROLE_ID;

export type UserRole = {
  /** User-facing label */
  label: string;
  /** Internal unique ID */
  customId: string;
  /** User-facing button style */
  buttonStyle: ButtonStyle;
  /** User-facing emoji for button and role shorthand */
  emoji: ComponentEmojiResolvable;
  /** Discord role ID */
  roleId?: string;
  /** Optional URL to display when this role is selected */
  externalURL?: string;
};

export const roles: UserRole[] = [
  {
    label: "Current RPI Student",
    customId: "current-rpi-student",
    buttonStyle: ButtonStyle.Primary,
    emoji: "🏫",
    roleId: DISCORD_SERVER_VERIFIED_ROLE_ID,
  },
  {
    label: "Current RPI Faculty",
    customId: "current-rpi-faculty",
    buttonStyle: ButtonStyle.Secondary,
    emoji: "🧑‍🏫",
    roleId: DISCORD_SERVER_VERIFIED_ROLE_ID,
  },
  {
    label: "RPI Alumn",
    customId: "rpi-alum",
    buttonStyle: ButtonStyle.Secondary,
    emoji: "🧑‍🎓",
    externalURL: "https://forms.gle/DisKuZy4AJf17pk69",
  },
  {
    label: "Guest",
    customId: "guest",
    buttonStyle: ButtonStyle.Danger,
    emoji: "👋",
  },
];
