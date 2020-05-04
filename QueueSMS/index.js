const { v4: uuid } = require('uuid');
const { acceptedRes, errorRes } = require('../lib/http-result')
const validateJson = require('../lib/validate-sms-json')

module.exports = async function (context, request) {
  const correlationId = request.headers['correlationId'] || context.invocationId || uuid()

  const data = {
    correlationId,
    submittedAt: new Date().toISOString(),
    ...request.body
  }

  // Verify that input data is present and correct
  const validation = validateJson(data)
  if (validation && validation.errors) {
    return context.res = errorRes('One or more field has invalid data, please see usage here: https://github.com/vtfk/azf-send-sms!', validation.errors, correlationId, 400) 
  }

  try {
    // Push the data into the queue
    context.bindings.queue = data
    context.log('info', ['index', 'queue', correlationId, 'receivers', data.receivers, 'queued'])

    // Build status URL and return 202
    const statusEndpoint = `https://${process.env.WEBSITE_HOSTNAME}/api/sms/${correlationId}`;
    context.res = acceptedRes(statusEndpoint, `SMS added to Queue! Status: ${statusEndpoint}`, correlationId)
  } catch (error) {
    context.log.error('error', ['index', 'queue', correlationId, 'receivers', data.receivers, error])
    context.res = errorRes('Something happened!', error.message, correlationId)
  }
}
