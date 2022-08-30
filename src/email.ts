import Mailjet from "node-mailjet";
import { UserRole } from "./roles";

const SERVER_NAME = process.env.SERVER_NAME;

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

/** Send an email to a user with their verification code. */
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
        TemplateID: process.env.MAILJET_TEMPLATE_ID,
        TemplateLanguage: true,
        Subject: `[${SERVER_NAME}] ${role.emoji} Verify ${role.label} Status`,
        Variables: {
          server_name: SERVER_NAME,
          firstname: userFullName.split(" ")[0],
          verification_code: verificationCode,
        },
      },
    ],
  };
  return mailjet.post("send", { version: "v3.1" }).request(data);
}
