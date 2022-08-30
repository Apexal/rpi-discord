import Keyv from "keyv";
import { UserRole } from "./roles";

export const keyv = new Keyv();

export type UserCache = {
  userRoleCustomId: UserRole["customId"];
  discordUserId: string;
  fullName: string;
  rpiUsername: string;
  verificationCode?: string;
  graduationYear?: string;
  purpose?: string;
};
