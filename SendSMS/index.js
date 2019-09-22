const sendSms = require('../lib/send-sms')

module.exports = async function (context, request) {
  const data = request.body

  // Verify that input data is present and correct
  if(!(data && data.receivers && Array.isArray(data.receivers) && data.message)) {
    return context.res = {
      status: 400,
      body: 'Please see usage here: https://github.com/vtfk/azf-send-sms'
    }
  }

  try {
    const result = await sendSms(context, data)
    context.log('info', ['index', 'send', 'receivers', data.receivers, 'success'])

    context.res = {
      status: 200,
      body: result,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  } catch (error) {
    context.log.error('error', ['index', 'send', 'receivers', data.receivers, error])

    context.res = {
      status: 500,
      body: "Something happened! " + error.message
    }
  }
}
