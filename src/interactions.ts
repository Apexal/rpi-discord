import {
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { UserRole } from "./roles";

/** Generate a row of buttons from the given user roles. */
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

/** Generate a modal with input fields determined by the role. */
export function generateRoleModal(role: UserRole) {
  const modal = new ModalBuilder()
    .setCustomId(role.customId + "-modal")
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

  // RPI-affiliated users are asked for their RPI email
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

  // Current students and alum are asked for their graduation year
  if (role.customId === "current-rpi-student" || role.customId === "rpi-alum") {
    const graduationYearInput = new TextInputBuilder()
      .setCustomId("graduation-year")
      .setLabel(
        `What year ${
          role.customId === "current-rpi-student" ? "will" : "did"
        } you graduate?`
      )
      .setStyle(TextInputStyle.Short);
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        graduationYearInput
      ) as ActionRowBuilder<TextInputBuilder>
    );
  }

  // Guests are asked what their purpose in joining is
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
