const { acceptedRes, okRes, errorRes } = require('../lib/http-result')

module.exports = async function (context, request) {
  const correlationId = request.params.correlationId || request.headers.correlationId
  if (!correlationId) {
    context.log('error', ['status', 'no-correlation-id', request.params])
    context.res = errorRes('No correlationId was passed in the url.. Weird.. How did you even get here?')
    return
  }

  // Get data from blob storage
  const blobData = context.bindings.storage

  if (blobData) {
    // Return returned blob data if set
    context.res = okRes(blobData, correlationId)
    context.log('info', ['status', correlationId, 'OK'])
  } else {
    // Check back in 10 seconds!
    context.res = acceptedRes(request.originalUrl, 'Not finished yet, check back in a bit..', correlationId)
    context.log('info', ['status', correlationId, 'Not finished yet..'])
  }
}
