  const { Resend } = require("resend");
  const env = require("../config/env.js");

  const resend = new Resend(env.resendApiKey);

  const sendEmail = async ({ to, subject, html, replyTo, }) => {
    try {
      const response = await resend.emails.send({
        from: "Invoice Pro <noreply@yourdomain.com>",
        to,
        subject,
        html,
        reply_to: replyTo,
      });

      if (response.error) {
        console.error(
          "Resend API Error:",
          response.error
        );

        return {
          success: false,
          error: response.error,
        };
      }

      console.log(
        "Email sent successfully:",
        response.data
      );

      return {
        success: true,
        data: response.data,
      };

    } catch (error) {
      console.error(
        "Email sending failed:",
        error
      );

      return {
        success: false,
        error,
      };
    }
  };

  module.exports = sendEmail;