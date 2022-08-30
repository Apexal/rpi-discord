import Mailjet from "node-mailjet";
import { UserRole } from "./roles";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

export function sendVerificationEmail(
  role: UserRole,
  userFullName: string,
  userEmail: string,
  verificationCode: string
) {
  const data = {
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_FROM_EMAIL,
          Name: "ITWS Discord",
        },
        To: [
          {
            Email: userEmail,
          },
        ],
        Subject: `[ITWS Discord] ${role.emoji} Verify ${role.label} Status`,
        HTMLPart: `
          Hello, ${userFullName}!

          To verify your identity on the <b>ITWS Discord server</b> as an <b>${role.label}</b>, please reply to the Discord bot with the following verification code:

          <h1>${verificationCode}</h1>

          Thank you.
        `,
        TextPart: `
        Hello, ${userFullName}!

          To verify your identity on the ITWS Discord server as an ${role.label}, please reply to the Discord bot with the following verification code:

          ${verificationCode}

          Thank you.`,
      },
    ],
  };
  return mailjet.post("send", { version: "v3.1" }).request(data);
}
