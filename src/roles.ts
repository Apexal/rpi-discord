import { ButtonStyle, ComponentEmojiResolvable } from "discord.js";

export type UserRole = {
  label: string;
  customId: string;
  buttonStyle: ButtonStyle;
  buttonEmoji: ComponentEmojiResolvable;
};

export const roles: UserRole[] = [
  {
    label: "Current RPI Student",
    customId: "current-rpi-student",
    buttonStyle: ButtonStyle.Primary,
    buttonEmoji: "👩‍🎓",
  },
  {
    label: "Current RPI Faculty",
    customId: "current-rpi-faculty",
    buttonStyle: ButtonStyle.Secondary,
    buttonEmoji: "🧑‍🏫",
  },
  {
    label: "RPI Alumn",
    customId: "current-rpi-alumn",
    buttonStyle: ButtonStyle.Secondary,
    buttonEmoji: "🧑‍🎓",
  },
  {
    label: "Guest",
    customId: "guest",
    buttonStyle: ButtonStyle.Danger,
    buttonEmoji: "👋",
  },
];
