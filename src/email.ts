import Mailjet from "node-mailjet";
import { UserRole } from "./roles";

const SERVER_NAME = process.env.SERVER_NAME;

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
          Name: process.env.SERVER_NAME,
        },
        To: [
          {
            Email: userEmail,
          },
        ],
        Subject: `[${SERVER_NAME}] ${role.emoji} Verify ${role.label} Status`,
        HTMLPart: `
          <p>Hello, ${userFullName}!</p>

          <p>To verify your identity on the <b>${SERVER_NAME} server</b> as an <b>${role.label}</b>, please reply to the Discord bot with the following verification code:</p>

          <h1>${verificationCode}</h1>

          <p>Thank you.</p>
        `,
        TextPart: `
          Hello, ${userFullName}!

          To verify your identity on the ${SERVER_NAME} server as an ${role.label}, please reply to the Discord bot with the following verification code:

          ${verificationCode}

          Thank you.`,
      },
    ],
  };
  return mailjet.post("send", { version: "v3.1" }).request(data);
}
