import {
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { UserRole } from "./roles";

export function generateRoleButtonActionRow(roles: UserRole[]) {
  return new ActionRowBuilder().addComponents(
    roles.map((role) =>
      new ButtonBuilder()
        .setCustomId("am-" + role.customId)
        .setLabel(role.label)
        .setStyle(role.buttonStyle)
        .setEmoji(role.emoji)
    )
  ) as ActionRowBuilder<ButtonBuilder>;
}

export function generateRoleModal(role: UserRole) {
  const modal = new ModalBuilder()
    .setCustomId("current-student-modal")
    .setTitle(`Verify ${role.label} Status`);

  const nameInput = new TextInputBuilder()
    .setCustomId("full-name")
    .setLabel("What's your full name?")
    .setStyle(TextInputStyle.Short);

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      nameInput
    ) as ActionRowBuilder<TextInputBuilder>
  );

  if (
    role.customId === "current-rpi-student" ||
    role.customId === "current-rpi-faculty"
  ) {
    const rpiEmailInput = new TextInputBuilder()
      .setCustomId("rpi-email")
      .setLabel("What's your RPI email address?")
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        rpiEmailInput
      ) as ActionRowBuilder<TextInputBuilder>
    );
  }

  if (
    role.customId === "current-rpi-student" ||
    role.customId === "rpi-alumn"
  ) {
    const graduationYearInput = new TextInputBuilder()
      .setCustomId("graduation-year")
      .setLabel("What year will/did you graduate?")
      .setStyle(TextInputStyle.Short);
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        graduationYearInput
      ) as ActionRowBuilder<TextInputBuilder>
    );
  }

  if (role.customId === "guest") {
    const purposeInput = new TextInputBuilder()
      .setCustomId("purpose")
      .setLabel("What's your purpose in joining the server?")
      .setStyle(TextInputStyle.Short);
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        purposeInput
      ) as ActionRowBuilder<TextInputBuilder>
    );
  }

  return modal;
}
