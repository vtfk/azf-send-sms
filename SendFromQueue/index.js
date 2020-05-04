const validateJson = require('../lib/validate-sms-json')
const sendSms = require('../lib/send-sms')

module.exports = async function (context, sms) {
  // Validate JSON just to be sure that everything is OK..
  const validation = validateJson(sms)
  if (validation && validation.errors) {
    return context.done(validation.errors)
  }

  try {
    // Send SMS to PSWinCom
    context.log('info', ['index', 'send', 'receivers', sms.receivers, 'sending message'])
    const result = await sendSms(context, sms)

    // Validate result from PsWinCom
    if (result.login === 'FAIL' || (result.refs && Object.keys(result.refs).length < 1)) {
      throw result
    }

    context.log('info', ['index', 'send', 'receivers', sms.receivers, 'message sent', result])
    context.done(null, result)
  } catch (error) {
    context.log.error('error', ['index', 'send', 'receivers', sms.receivers, error])
    context.done(error)
  }
}
