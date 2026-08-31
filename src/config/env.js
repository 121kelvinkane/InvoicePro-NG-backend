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

module.exports = env;