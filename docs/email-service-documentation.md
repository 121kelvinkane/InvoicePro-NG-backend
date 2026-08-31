# Email Service Documentation

## Overview

The email service is a lightweight wrapper around Resend for sending HTML email messages from the Invoice Pro backend. It is designed to keep email delivery logic centralized and reusable, while allowing templates to be created separately from the transport layer.

At the moment, the service is used for account onboarding: when a new user registers, the system sends a welcome email without blocking the registration flow.

---

## Service responsibilities

The email service handles:

- Creating the Resend client
- Sending emails with a consistent sender format
- Accepting HTML content for rich email templates
- Formatting optional reply-to addresses
- Logging failures and returning a clean application-level error

This keeps the rest of the application focused on business logic instead of email delivery details.

---

## File structure

The email system is split across a few focused files:

- `src/services/email.service.js` — core transport function
- `src/emailTemplates/emailLayout.js` — shared email shell and footer layout
- `src/emailTemplates/welcomeTemplate.js` — welcome email content
- `src/services/auth.service.js` — where the welcome email is triggered during signup
- `src/config/env.js` — email configuration values loaded from environment variables

---

## Configuration

The email service depends on environment variables defined in the project config.

### Required variables

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
APP_NAME=Invoice Pro
APP_URL=http://localhost:3000
APP_LOGO=
APP_TAGLINE=Invoice management made simple
```

### Source of configuration

The config is read in `src/config/env.js`:

```js
const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  appName: process.env.APP_NAME,
  appUrl: process.env.APP_URL,
  appLogo: process.env.APP_LOGO,
  appTagline: process.env.APP_TAGLINE,
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
};
```

The default sender address is:

```text
Invoice Pro <onboarding@resend.dev>
```

If `RESEND_FROM_EMAIL` is not provided, the application falls back to Resend's default onboarding address.

---

## Core implementation

The main email function is defined in `src/services/email.service.js`:

```js
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
```

### Function contract

```js
sendEmail({
  to: "user@example.com",
  subject: "Welcome to Invoice Pro",
  html: "<p>Hello world</p>",
  replyTo: "support@invoicepro.com"
})
```

### Accepted inputs

- `to` — recipient email address or array of addresses
- `subject` — email subject line
- `html` — fully rendered HTML content
- `replyTo` — optional reply-to email address

### Return value

The function returns the Resend API response object for the send action when the request succeeds.

### Error behavior

If the email provider rejects the request, the function:

1. Logs the actual provider error to the console.
2. Throws a new application-level error: `Email could not be sent`

This keeps the caller responsible for deciding whether to fail the higher-level operation.

---

## Email template system

The project uses a reusable HTML email layout with per-template content injected into it.

### Shared layout

`src/emailTemplates/emailLayout.js` provides the outer structure of the email:

- responsive table-based HTML email structure
- branded header area
- title and subtitle
- main content body
- footer with app tag line and website link
- dynamic year in the footer

The layout accepts:

```js
layOut({ title, subtitle, body })
```

It is designed to make all emails have the same visual structure, so all templates remain consistent.

### Welcome template

`src/emailTemplates/welcomeTemplate.js` builds the onboarding email message.

It uses:

- the user's display name in the title
- a confirmation message
- a CTA button linking to `APP_URL`
- a branded closing message from the team

Example resulting title:

```text
Welcome to Invoice Pro, Ada!
```

---

## How the welcome email is triggered

The welcome email is sent from `src/services/auth.service.js` during user registration.

```js
sendEmail({
  to: newUser.email,
  subject: "Welcome to Invoice Pro",
  html: welcomeEmail({
    name: newUser.name,
  }),
}).catch((error) => {
  console.error(
    "Welcome email could not be sent:",
    error.message
  );
});
```

### Behavior

This is intentionally non-blocking:

- user registration continues even if email delivery fails
- the error is logged to the console
- the application does not reject the user creation request because of email issues

This makes the onboarding flow resilient and avoids preventing account creation when the mail provider is temporarily unavailable.

---

## Example use cases

### Sending a custom message

```js
const sendEmail = require("../services/email.service");

await sendEmail({
  to: "client@example.com",
  subject: "Invoice reminder",
  html: "<p>Your invoice is due soon.</p>",
  replyTo: "billing@invoicepro.com",
});
```

### Sending a template-based email

```js
const welcomeEmail = require("../emailTemplates/welcomeTemplate");

await sendEmail({
  to: user.email,
  subject: "Welcome to Invoice Pro",
  html: welcomeEmail({ name: user.name }),
});
```

---

## Current implementation status

The email service is currently in its early stage and supports:

- welcome emails on signup
- HTML emails through Resend
- centralized template-based email generation

It does not yet include:

- queue-based delivery
- retry logic for failed sends
- email verification flow
- password reset emails
- invoice or notification emails
- templates for multiple languages or campaigns

---

## Operational notes

- Emails are sent in the same request lifecycle as registration, so delivery speed depends on the Resend API response time.
- The service logs errors but does not currently retry failed sends automatically.
- Email content is HTML-based, which is appropriate for branded and styled transactional messages.
- The sender identity is controlled by `RESEND_FROM_EMAIL` and the project branding values in the environment.

---

## Summary

The email service is a simple but clean abstraction for transactional email delivery. It centralizes communication with Resend, keeps templates reusable, and lets the app send branded messages without mixing email logic into the rest of the codebase. The current flow is focused on user onboarding, but the service is structured so additional email types can be added easily in the future.
