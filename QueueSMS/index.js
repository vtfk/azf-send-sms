const { v4: uuid } = require('uuid')
const { acceptedRes, errorRes } = require('../lib/http-result')
const validateJson = require('../lib/validate-sms-json')

module.exports = async function (context, request) {
  const correlationId = request.headers.correlationId || context.invocationId || uuid()

  const data = {
    correlationId,
    submittedAt: new Date().toISOString(),
    ...request.body
  }

  // Verify that input data is present and correct
  const validation = validateJson(data)
  if (validation && validation.errors) {
    context.res = errorRes('One or more field has invalid data, please see usage here: https://github.com/vtfk/azf-send-sms!', validation.errors, correlationId, 400)
    return
  }

  try {
    // Push the data into the queue
    context.bindings.queue = data
    context.log('info', ['queue', correlationId, 'receivers', data.receivers, 'queued'])

    // Build status URL and return 202
    const statusEndpoint = `https://${process.env.WEBSITE_HOSTNAME}/api/sms/${correlationId}`
    context.res = acceptedRes(statusEndpoint, `SMS added to Queue! Status: ${statusEndpoint}`, correlationId, 1)
  } catch (error) {
    context.log.error('error', ['queue', correlationId, 'receivers', data.receivers, error])
    context.res = errorRes('Something happened!', error.message, correlationId)
  }
}
