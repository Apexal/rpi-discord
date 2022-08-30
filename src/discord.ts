import { UserCache } from "./cache";
import { UserRole } from "./roles";

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

export function verifyRPIUser(userCache: UserCache) {
  const { discordUserId, userRoleCustomId, fullName, graduationYear } =
    userCache;

  const serverNickname = generateDiscordNickname(userCache);
  console.log(serverNickname);
}
