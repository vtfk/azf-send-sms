const { sendSms } = require('pswincom-gateway')
const { PSWIN } = require('../config')

module.exports = (context, data) => {
  return new Promise((resolve, reject) => {
    const setup = {
      user: PSWIN.USERNAME,
      password: PSWIN.PASSWORD,
      sender: data.sender || PSWIN.DEFAULT_SENDER,
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
