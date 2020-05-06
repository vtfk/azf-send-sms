const { v4: uuid } = require('uuid')
const validateJson = require('../lib/validate-sms-json')
const sendSms = require('../lib/send-sms')

module.exports = async function (context, sms) {
  const correlationId = sms.correlationId || uuid()
  let result

  // Validate JSON just to be sure that everything is OK..
  const validation = validateJson(sms)
  if (validation && validation.errors) {
    return context.done({ ...validation.errors, correlationId })
  }

  context.log(JSON.stringify(context, null, 2))

  try {
    // Send SMS to PSWinCom
    context.log('info', ['poison-queue', correlationId, 'receivers', sms.receivers, 'sending sms'])
    result = await sendSms(context, sms)

    // Validate result from PsWinCom
    if (result.login === 'FAIL' || (result.refs && Object.keys(result.refs).length < 1)) {
      throw result
    }

    context.log('info', ['poison-queue', correlationId, 'receivers', sms.receivers, 'sms sent', result])
  } catch (error) {
    context.log.error('info', ['poison-queue', correlationId, 'last retry failed'])

    // Export file to status blob storage
    context.bindings.storage = {
      correlationId,
      submittedAt: sms.submittedAt,
      failedAt: new Date().toISOString(),
      error: result
    }

    // Export file to error blob storage
    context.bindings.errorStorage = {
      correlationId,
      submittedAt: sms.submittedAt,
      failedAt: new Date().toISOString(),
      error: result,
      request: sms
    }

    context.log('info', ['poison-queue', correlationId, 'blobs set'])
  }
}
