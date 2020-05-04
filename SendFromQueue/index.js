const { v4: uuid } = require('uuid')
const validateJson = require('../lib/validate-sms-json')
const sendSms = require('../lib/send-sms')

module.exports = async function (context, sms) {
  const correlationId = sms.correlationId || uuid()

  // Validate JSON just to be sure that everything is OK..
  const validation = validateJson(sms)
  if (validation && validation.errors) {
    return context.done({ ...validation.errors, correlationId })
  }

  try {
    // Send SMS to PSWinCom
    context.log('info', ['send', correlationId, 'receivers', sms.receivers, 'sending sms'])
    const result = await sendSms(context, sms)

    context.log('info', ['send', correlationId, 'receivers', sms.receivers, 'sms sent', result])

    // Validate result from PsWinCom
    if (result.login === 'FAIL' || (result.refs && Object.keys(result.refs).length < 1)) {
      throw result
    }

    // Export file to blob storage
    context.bindings.storage = {
      correlationId,
      submittedAt: sms.submittedAt,
      completedAt: new Date().toISOString(),
      result
    }

    context.log('info', ['send', correlationId, 'blob set'])
  } catch (error) {
    context.log.error('error', ['send', correlationId, 'receivers', sms.receivers, error])
    context.done(error)
  }
}
