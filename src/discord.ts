import { client } from ".";
import { UserCache } from "./cache";
import { roles, UserRole } from "./roles";

function generateDiscordNickname({
  fullName,
  rpiUsername,
  graduationYear,
}: UserCache) {
  let suffix = `(${rpiUsername})`;

  if (graduationYear) {
    const last2Digits = graduationYear.slice(graduationYear.length - 2);
    suffix = `'${last2Digits} ${suffix}`;
  }

  // Max space left for the name, taking into account the suffix and the space between name and suffix
  const maxNameLength = 32 - (suffix.length + 1);

  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

  let name = `${firstName} ${lastInitial}`;

  if (name.length > maxNameLength) {
    const overflow = name.length - maxNameLength;
    console.log("OVERFLOWING NAME BY " + overflow);
  }

  return `${name} ${suffix}`;
}

export async function verifyRPIUser(userCache: UserCache) {
  const { discordUserId, userRoleCustomId, fullName, graduationYear } =
    userCache;

  const userRole = roles.find((role) => role.customId === userRoleCustomId);

  if (!userRole) {
    // TODO
    return;
  }

  const serverNickname = generateDiscordNickname(userCache);
  console.log(serverNickname);

  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID!);

  if (!guild) {
    // TODO
    return;
  }

  const member = await guild.members.fetch(discordUserId);

  if (!member) {
    // TODO
    return;
  }

  try {
    member.setNickname(serverNickname);
    console.log("Set user nickname upon verification", {
      userCache,
      serverNickname,
    });
  } catch (error) {
    // TODO
  }

  if (userRole.roleId) {
    try {
      member.roles.add(userRole.roleId);
      console.log("Added role to user upon verification", { userCache });
    } catch (error) {
      // TODO
    }
  }
}
