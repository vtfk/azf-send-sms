module.exports = {
  PSWIN: {
    USERNAME: process.env.PSWIN_USERNAME || 'user',
    PASSWORD: process.env.PSWIN_PASSWORD || 'password',
    DEFAULT_SENDER: process.env.DEFAULT_SENDER || 'Default'
  },
  API_HOSTNAME: process.env.API_HOSTNAME || 'sms.send.com',
  WEBSITE_HOSTNAME: process.env.WEBSITE_HOSTNAME || 'localhost:7071'
}
