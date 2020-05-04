const validateJson = require('../lib/validate-sms-json')

module.exports = async function (context, request) {
  const data = request.body

  // Verify that input data is present and correct
  const validation = validateJson(data)
  if (validation && validation.errors) {
    context.res = {
      status: 400,
      body: {
        message: 'One or more field has invalid data, please see usage here: https://github.com/vtfk/azf-send-sms',
        errors: validation.errors
      }
    }
    return
  }

  try {
    context.bindings.queue = data
    context.log('info', ['index', 'send', 'receivers', data.receivers, 'queued'])

    context.res = {
      status: 202,
      body: 'Queued!',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  } catch (error) {
    context.log.error('error', ['index', 'send', 'receivers', data.receivers, error])

    context.res = {
      status: 500,
      body: 'Something happened! ' + error.message
    }
  }
}
