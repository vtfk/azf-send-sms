const { sendSms } = require('pswincom-gateway')

module.exports = (context, data) => {
  return new Promise((resolve, reject) => {
    const setup = {
      user: process.env.PSWIN_USERNAME,
      password: process.env.PSWIN_PASSWORD,
      sender: data.sender || process.env.DEFAULT_SENDER,
      receivers: data.receivers,
      message: data.message,
      done: handleResult,
      error: handleError
    }

    if (data.operation) {
      setup.operation = parseInt(data.operation, 10)
    }

    function handleResult (result) {
      context.log('info', ['send-sms', 'sender', data.sender, 'receivers', data.receivers, 'success'])
      resolve(result)
    }

    function handleError (error) {
      context.log.error('error', ['send-sms', 'sender', data.sender, 'receivers', data.receivers, error])
      reject(error)
    }

    sendSms(setup)
  })
}
