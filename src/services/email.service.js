const env = require("../config/env");
const { Resend } = require("resend");

const resend = new Resend(env.resendApiKey);

const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const response = await resend.emails.send({
      from: `Invoice Pro <${env.resendFromEmail}>`,
      to,
      subject,
      html,
      reply_to: replyTo,
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;